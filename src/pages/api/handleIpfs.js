//functions inside the API folder are performed on the backend - using this to avoid CORSE error when fetching rom IPFS

const handler = async (req, res) => {
  const pinataGateway = "https://gateway.pinata.cloud/ipfs/";
  //const ipfsGateway = "https://ipfs.io/ipfs/";
  const uri = req.body.replace("ipfs://", pinataGateway);

  try {
    const response = await fetch(uri);
    const data = await response.json();

    return res.end(JSON.stringify({ success: data }));
  } catch (error) {
    console.log(error);
    return res.end(JSON.stringify({ error: error.message }));
  }
};

export default handler;
