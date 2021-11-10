const couriers = {
  jne_domestic_regular: {
    ids: "jne_domestic_regular",
    name: "JNE Regular",
    image: "/assets/images/courier_JNE Regular.png",
    shipTo: "Indonesia",
  },
  shipper: {
    ids: "shipper",
    name: "Shipper",
    image: "/assets/images/courier_Shipper.png",
    shipTo: "Indonesia",
  },
  poslaju: {
    ids: "poslaju",
    name: "Pos Laju",
    image: "/assets/images/courier_Poslaju.png",
    shipTo: "Malaysia",
  },
  poslaju_international: {
    ids: "poslaju_international",
    name: "Pos Laju International Air Parcel",
    image: "/assets/images/courier_Poslaju International Air Parcel.png",
    shipTo: "Malaysia",
  },
  flexipack: {
    ids: "flexipack",
    name: "Flexipack",
    image: "/assets/images/courier_Flexipack.png",
    shipTo: "Malaysia",
  },
  citylink: {
    ids: "citylink",
    name: "City-Link",
    image: "/assets/images/courier_Citylink.png",
    shipTo: "Malaysia",
  },
  janio: {
    ids: "janio",
    name: "Janio",
    image: "/assets/images/janio-min.png",
    shipTo: "Malaysia",
  },
  ninjavan: {
    ids: "ninjavan",
    name: "Ninja Van",
    image: "/assets/images/courier_ninjavan.png",
    shipTo: "Malaysia",
  },
  ninja_van: {
    ids: "ninjavan",
    name: "Ninja Van",
    image: "/assets/images/courier_ninjavan.png",
    shipTo: "Malaysia",
  },
  NINJA_VAN_MY_SG: {
    ids: "NINJA_VAN_MY_SG",
    name: "Ninja Van",
    image: "/assets/images/courier_ninjavan.png",
    shipTo: "Singapore",
  },
  NINJA_VAN: {
    ids: "NINJA_VAN",
    name: "Ninja Van",
    image: "/assets/images/courier_ninjavan.png",
    shipTo: "Singapore",
  },
  self_pickup: {
    ids: "self_pickup",
    name: "Self Pickup",
    image: "/assets/images/icon__selfpickup_courrier.png",
    shipTo:
      JSON.parse(localStorage.getItem("AVAPERSIST:shop"))?.country?.name ||
      "Malaysia",
  },
  NINJA_VAN_SG: {
    ids: "NINJA_VAN_SG",
    name: "Ninja Van",
    image: "/assets/images/courier_ninjavan.png",
    shipTo: "Singapore",
  },
  ninja_xpress: {
    ids: "ninja_xpress",
    name: "Ninja Xpress",
    image: "/assets/images/couriers/ninja-xpress.png",
    shipTo: "Indonesia",
  },
  jnt: {
    ids: "jnt",
    name: "JNT",
    image: "/assets/images/couriers/jnt.png",
    shipTo: "Indonesia",
  },
  jne: {
    ids: "jne",
    name: "JNE",
    image: "/assets/images/couriers/jne.png",
    shipTo: "Indonesia",
  },
  alfatre: {
    ids: "alfatre",
    name: "Alfatre",
    image: "/assets/images/couriers/alfatre.png",
    shipTo: "Indonesia",
  },
  "pos-indonesia": {
    ids: "pos-indonesia",
    name: "Pos Indonesia",
    image: "/assets/images/couriers/pos-indonesia.png",
    shipTo: "Indonesia",
  },
  sicepat: {
    ids: "sicepat",
    name: "Sicepat",
    image: "/assets/images/couriers/sicepat.jpg",
    shipTo: "Indonesia",
  },
  wahana: {
    ids: "wahana",
    name: "Wahana",
    image: "/assets/images/couriers/wahana.png",
    shipTo: "Indonesia",
  },
  "lion-parcel": {
    ids: "lion-parcel",
    name: "Lion Parcel",
    image: "/assets/images/couriers/lion-parcel.png",
    shipTo: "Indonesia",
  },
  tiki: {
    ids: "tiki",
    name: "TIKI",
    image: "/assets/images/couriers/tiki.png",
    shipTo: "Indonesia",
  },
  gosend: {
    ids: "gosend",
    name: "GOSEND",
    image: "/assets/images/couriers/gosend.png",
    shipTo: "Indonesia",
  },
  "grab-express": {
    ids: "grab-express",
    name: "Grab Express",
    image: "/assets/images/couriers/grab-express.png",
    shipTo: "Indonesia",
  },
  "ninja-xpress": {
    ids: "ninja-xpress",
    name: "Ninja Xpress",
    image: "/assets/images/couriers/ninja-xpress.png",
    shipTo: "Indonesia",
  },
};

export default couriers;

export const selectCourier = (id) => {
  const newID = id.toLowerCase();
  switch (newID) {
    case "jne_domestic_regular":
    case "jne regular":
    case "jne":
      return couriers["jne_domestic_regular"];

    case "shipper":
      return couriers["shipper"];

    case "poslaju":
      return couriers["poslaju"];

    case "poslaju_international":
      return couriers["poslaju_international"];

    case "flexipack":
      return couriers["flexipack"];

    case "citylink":
      return couriers["citylink"];

    case "janio":
      return couriers["janio"];

    case "NINJA_VAN":
    case "ninja_van":
    case "ninja van":
      return couriers["ninjavan"];

    case "Ninja Van Singapore":
    case "NINJA_VAN_SG":
    case "ninja van singapore":
    case "ninja_van_sg":
    case "ninja_van_my_sg":
      return couriers["NINJA_VAN_SG"];

    case "jnt":
      return couriers["jnt"];

    case "alfatre":
    case "atx":
      return couriers["alfatre"];

    case "pos":
    case "pos-indonesia":
      return couriers["pos-indonesia"];

    case "scp":
    case "sicepat":
      return couriers["sicepat"];

    case "wahana":
    case "whn":
      return couriers["wahana"];

    case "lion-parcel":
    case "lpa":
      return couriers["lion-parcel"];

    case "tik":
    case "tiki":
      return couriers["tiki"];

    case "gsn":
    case "gosend":
      return couriers["gosend"];

    case "grb":
    case "grab-express":
      return couriers["grab-express"];

    case "ninja-xpress":
    case "nin":
      return couriers["ninja-xpress"];

    case "self_pickup":
    case "self pickup":
      return couriers["self_pickup"];

    case "ninja_xpress":
    case "ninja xpress":
      return couriers["ninja_xpress"];
    default:
      return [];
  }
};
