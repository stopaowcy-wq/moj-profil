export default async function handler(req, res) {
  try {
    const keyId = process.env.B2_KEY_ID;
    const applicationKey = process.env.B2_APPLICATION_KEY;

    // 1. Autoryzacja w Backblaze B2 (pobranie tokenu)
    const credentials = btoa(`${keyId}:${applicationKey}`);
    const authResponse = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (!authResponse.ok) {
      throw new Error("Błąd autoryzacji w Backblaze");
    }

    const authData = await authResponse.json();
    const { apiUrl, authorizationToken } = authData;

    // Pobieramy listę kubełków, aby znaleźć ten właściwy
    const bucketsResponse = await fetch(`${apiUrl}/b2api/v2/b2_list_buckets`, {
      method: "POST",
      headers: { Authorization: authorizationToken },
      body: JSON.stringify({ accountId: authData.accountId }),
    });

    const bucketsData = await bucketsResponse.json();
    const bucket = bucketsData.buckets.find(b => b.bucketName === "galeria-marcina");

    if (!bucket) {
      throw new Error("Nie znaleziono kubełka galeria-marcina");
    }

    // 2. Pobranie listy plików z kubełka
    const filesResponse = await fetch(`${apiUrl}/b2api/v2/b2_list_file_names`, {
      method: "POST",
      headers: { Authorization: authorizationToken },
      body: JSON.stringify({
        bucketId: bucket.bucketId,
        maxFileCount: 10000,
      }),
    });

    const filesData = await filesResponse.json();

    // 3. Konwersja na format XML, żeby dopasować do Twojego kodu w React
    const xmlFiles = filesData.files
      .map(file => `
        <Contents>
          <Key>${file.fileName}</Key>
          <Size>${file.contentLength}</Size>
        </Contents>
      `).join("");

    const s3XmlFormat = `<?xml version="1.0" encoding="UTF-8"?>
    <ListBucketResult>
      <Name>galeria-marcina</Name>
      ${xmlFiles}
    </ListBucketResult>`;

    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(s3XmlFormat);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}