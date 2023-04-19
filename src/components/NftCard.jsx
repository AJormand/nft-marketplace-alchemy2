import React from "react";

const NftCard = ({ data, setSelectedNft }) => {
  return (
    <div
      className="w-56 h-72 bg-slate-50 rounded-xl p-3 hover:bg-slate-100"
      onClick={() => setSelectedNft(data)}
    >
      <div className="h-2/3 flex items-center justify-center overflow-hidden">
        <img
          src={data.image}
          className="max-w-full max-h-full rounded-sm"
          alt=""
        />
      </div>

      <div className="h-1/3 p-2 text-xs">
        <div className="flex gap-2">
          <p>id:</p>
          <p>{data.id}</p>
        </div>
        <div className="flex gap-2">
          <p>name:</p>
          <p>{data.name}</p>
        </div>
        <div className="flex gap-2">
          <p>Owner:</p>
          <p>
            {data.owner?.slice(0, 4)}...{data.owner?.slice(-4)}
          </p>
        </div>
        <div className="flex gap-2">
          <p>Is listed: </p>
          <p>{data.isListed?.toString()}</p>
        </div>
        <div className="flex gap-2">
          <p>Price: </p>
          <p>{data.price} ETH</p>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
