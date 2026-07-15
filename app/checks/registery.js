import missingImages from "./products/missingImages";
import emptyCollections from "./collections/emptyCollections";
import missingSKUs from "./products/missingSKUs";
import duplicateSKUs from "./products/duplicateSKUs";
import zeroPrice from "./pricings/zeroPrice";

export const checkRegistry = [
  missingImages,
  emptyCollections,
  missingSKUs,
  duplicateSKUs,
  zeroPrice,
];
