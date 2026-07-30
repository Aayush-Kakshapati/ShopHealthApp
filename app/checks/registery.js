import missingImages from "./products/missingImages";
import emptyCollections from "./collections/emptyCollections";
// import missingSKUs from "./products/missingSKUs";
// import duplicateSKUs from "./products/duplicateSKUs";
import zeroPrice from "./pricings/zeroPrice";
import draftProducts from "./products/draftProducts";
import missingAltText from "./seo/missingAltText";
import missingVendor from "./products/missingVendor"
import zeroStock from "./products/zeroStock"

export const checkRegistry = [
  missingImages,
  emptyCollections,
  // missingSKUs,
  // duplicateSKUs,
  zeroPrice,
  draftProducts,
  missingAltText,
  missingVendor,
  zeroStock
];
