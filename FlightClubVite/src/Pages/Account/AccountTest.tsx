import * as React from "react";
import GenericTable from "../../Components/GenericTable";



const stockItems = [
  {
    id: 1,
    name: "Pencil",
    count: 3,
    image: {
      url:
        "https://user-images.githubusercontent.com/14864439/101538058-52edaa00-397b-11eb-8107-ea606bf90929.png",
      width: 100,
      height: 50
    }
  },
  {
    id: 2,
    name: "Paper",
    count: 4,
    image: {
      url:
        "https://user-images.githubusercontent.com/14864439/101538104-61d45c80-397b-11eb-8c56-b2de523b9aa3.png",
      width: 100,
      height: 50
    }
  },
  {
    id: 3,
    name: "Scissors",
    count: 4,
    image: {
      url:
        "https://user-images.githubusercontent.com/14864439/101538129-68fb6a80-397b-11eb-8250-e622fdf0f34c.png",
      width: 100,
      height: 50
    }
  }
];

export default function AccountTest() {
  return (
    <div className="App">
      <GenericTable
        headers={{
          id: "Id",
          name: "Name",
          count: "Count",
          image: "Image"
        }}
        items={stockItems}
        customRenderers={{
          image: (it) => (
            <img
              alt={`${it.name}`}
              src={it.image.url}
              width={it.image.width}
              height={it.image.height}
            />
          )
        }}
      />
    </div>
  );
}
