import ProductInformationBlock from "./ProductInformation";

function buf2hex(buffer) {
  // buffer is an ArrayBuffer
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

console.hex = (d) =>
  console.log(
    (Object(d).buffer instanceof ArrayBuffer
      ? new Uint8Array(d.buffer)
      : typeof d === "string"
      ? new TextEncoder("utf-8").encode(d)
      : new Uint8ClampedArray(d)
    ).reduce(
      (p, c, i, a) =>
        p +
        (i % 16 === 0 ? i.toString(16).padStart(6, 0) + "  " : " ") +
        c.toString(16).padStart(2, 0) +
        (i === a.length - 1 || i % 16 === 15
          ? " ".repeat((15 - (i % 16)) * 3) +
            Array.from(a)
              .splice(i - (i % 16), 16)
              .reduce(
                (r, v) =>
                  r +
                  ((v > 31 && v < 127) || v > 159
                    ? String.fromCharCode(v)
                    : "."),
                "  "
              ) +
            "\n"
          : ""),
      ""
    )
  );

export default class ApplicationUpdater {
  constructor(deviceVar) {
    this.device = deviceVar;
  }
  readInformationBlock() {
    return this.device
      .controlTransferIn(
        {
          requestType: "class",
          recipient: "interface",
          request: 2,
          value: 9,
          index: 0,
        },
        128
      )
      .then((result) => {
        console.log("RESULT :", result.data);
        let data = new Uint8Array(result.data.buffer);
        console.log("data :", data);

        let pInfo_magic = data.slice(0, 2);
        let pInfo_revSignature = data.slice(2, 4);
        let pInfo_man = data.slice(4, 6);
        let pInfo_hwId = data.slice(6, 7);
        let pInfo_hwSubId = data.slice(7, 8);
        let pInfo_revMajor = data.slice(8, 9);
        let pInfo_revMinor = data.slice(9, 10);
        let pInfo_features = data.slice(10, 14);
        let pInfo_serial = data.slice(14, 18);
        let pInfo_year = data.slice(18, 20);
        let pInfo_month = data.slice(20, 21);
        let pInfo_day = data.slice(21, 22);
        let pInfo_customText = new TextDecoder("utf-8")
          .decode(data.slice(22, 22 + 64))
          .replace(/[^a-z0-9]/gim, " ")
          .replace(/\s+/g, " ")
          .trim();
        pInfo_man = "" + pInfo_man[1] + "." + pInfo_man[0];
        let year = pInfo_year[0] | (pInfo_year[1] << 8);
        let magic = pInfo_magic[0] | (pInfo_magic[1] << 8);

        let productInformation = new ProductInformationBlock(
          magic,
          "0x" + buf2hex(pInfo_revSignature),
          pInfo_man,
          pInfo_hwId,
          pInfo_hwSubId,
          pInfo_revMajor + "." + pInfo_revMinor,
          "0x" + buf2hex(pInfo_features),
          "0x" + buf2hex(pInfo_serial),
          year,
          pInfo_month[0],
          pInfo_day[0],
          pInfo_customText
        );

        return Promise.resolve(productInformation);
      });
  }

 

}
