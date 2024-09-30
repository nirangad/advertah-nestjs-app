import {
  Merchant,
  Partner,
  ProductFeed,
  ProductFeedDefinition,
  ProductFeedFormat,
  ProductFeedParam,
} from 'src/data/models/schemas/partner.schema';

export const params: Partial<ProductFeedParam>[] = [
  {
    param: 'cid',
    type: 'string',
    default:
      '97,98,144,129,595,539,147,149,613,626,135,163,168,159,169,161,170,137,171,548,174,183,178,179,175,172,623,139,614,189,194,141,205,198,206,203,208,199,204,201,61,62,72,73,71,74,75,76,77,78,79,63,80,82,64,83,84,85,65,86,88,90,89,91,67,94,33,53,57,58,52,603,60,59,66,128,130,133,212,209,210,211,68,69,213,220,221,70,224,225,226,227,228,229,4,5,10,11,537,15,14,6,22,23,24,25,26,7,30,29,32,619,8,35,618,42,43,9,46,651,49,50,51,634,230,609,538,235,240,239,241,556,245,242,521,576,575,577,579,281,283,285,286,282,287,288,627,173,193,177,196,379,648,181,645,387,646,598,611,391,393,647,631,602,570,600,405,187,411,412,413,414,415,416,417,649,418,419,420,99,100,101,107,110,111,113,114,115,116,118,121,581,624,123,594,125,421,605,604,599,422,530,434,532,428,474,475,476,477,423,608,437,441,446,424,451,448,453,449,452,450,425,455,457,459,460,456,458,426,616,463,464,465,466,467,427,625,473,469,617,470,429,430,481,615,483,484,485,488,529,596,431,432,489,490,361,633,362,366,367,368,371,369,363,372,373,374,377,375,536,535,364,378,380,381,365,383,385,390,392,394,396,397,399,402,404,406,407,540,542,544,546,547,246,558,247,252,559,255,248,256,265,259,632,260,261,262,557,249,266,267,268,269,612,251,250,272,271,561,560,347,348,354,350,349,357,586,588,328,629,338,493,635,495,507,563,564,566,567,569,568',
  },
  { param: 'fid', type: 'string', default: '87443,88034,96910' },
  { param: 'rid', type: 'string', default: '0' },
  { param: 'hasEnhancedFeeds', type: 'string', default: '0' },
  {
    param: 'columns',
    type: 'string',
    default:
      'aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,brand_name,brand_id,colour,product_short_description,specifications,condition,product_model,model_number,dimensions,keywords,promotional_text,product_type,commission_group,merchant_product_category_path,merchant_product_second_category,merchant_product_third_category,rrp_price,saving,savings_percent,base_price,base_price_amount,base_price_text,product_price_old,delivery_restrictions,delivery_weight,warranty,terms_of_contract,delivery_time,in_stock,stock_quantity,valid_from,valid_to,is_for_sale,web_offer,pre_order,stock_status,size_stock_status,size_stock_amount,merchant_thumb_url,large_image,alternate_image,aw_thumb_url,alternate_image_two,alternate_image_three,reviews,average_rating,rating,number_available,ean,isbn,upc,mpn,parent_product_id,product_GTIN,basket_link,display_price,data_feed_id,alternate_image_four',
  },
  {
    param: 'format',
    type: 'string',
    default: ProductFeedFormat.CSV.toString(),
  },
  { param: 'delimiter', type: 'string', default: '%2C' },
  { param: 'compression', type: 'string', default: 'gzip' },
  { param: 'adultcontent', type: 'string', default: '1' },
];

/*
  Set Following:
  - params
*/
export const productFeed: Partial<ProductFeed> = {
  rawURL:
    'https://productdata.awin.com/datafeed/download/apikey/56e84b22b339b32850c44136209d6444/language/en/cid/97,98,144,129,595,539,147,149,613,626,135,163,168,159,169,161,170,137,171,548,174,183,178,179,175,172,623,139,614,189,194,141,205,198,206,203,208,199,204,201,61,62,72,73,71,74,75,76,77,78,79,63,80,82,64,83,84,85,65,86,88,90,89,91,67,94,33,53,57,58,52,603,60,59,66,128,130,133,212,209,210,211,68,69,213,220,221,70,224,225,226,227,228,229,4,5,10,11,537,15,14,6,22,23,24,25,26,7,30,29,32,619,8,35,618,42,43,9,46,651,49,50,51,634,230,609,538,235,240,239,241,556,245,242,521,576,575,577,579,281,283,285,286,282,287,288,627,173,193,177,196,379,648,181,645,387,646,598,611,391,393,647,631,602,570,600,405,187,411,412,413,414,415,416,417,649,418,419,420,99,100,101,107,110,111,113,114,115,116,118,121,581,624,123,594,125,421,605,604,599,422,530,434,532,428,474,475,476,477,423,608,437,441,446,424,451,448,453,449,452,450,425,455,457,459,460,456,458,426,616,463,464,465,466,467,427,625,473,469,617,470,429,430,481,615,483,484,485,488,529,596,431,432,489,490,361,633,362,366,367,368,371,369,363,372,373,374,377,375,536,535,364,378,380,381,365,383,385,390,392,394,396,397,399,402,404,406,407,540,542,544,546,547,246,558,247,252,559,255,248,256,265,259,632,260,261,262,557,249,266,267,268,269,612,251,250,272,271,561,560,347,348,354,350,349,357,586,588,328,629,338,493,635,495,507,563,564,566,567,569,568/fid/87443,88034,96910/rid/0/hasEnhancedFeeds/0/columns/aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,brand_name,brand_id,colour,product_short_description,specifications,condition,product_model,model_number,dimensions,keywords,promotional_text,product_type,commission_group,merchant_product_category_path,merchant_product_second_category,merchant_product_third_category,rrp_price,saving,savings_percent,base_price,base_price_amount,base_price_text,product_price_old,delivery_restrictions,delivery_weight,warranty,terms_of_contract,delivery_time,in_stock,stock_quantity,valid_from,valid_to,is_for_sale,web_offer,pre_order,stock_status,size_stock_status,size_stock_amount,merchant_thumb_url,large_image,alternate_image,aw_thumb_url,alternate_image_two,alternate_image_three,reviews,average_rating,rating,number_available,ean,isbn,upc,mpn,parent_product_id,product_GTIN,basket_link,display_price,data_feed_id,alternate_image_four/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/',
  url: 'https://productdata.awin.com/datafeed/download/apikey/56e84b22b339b32850c44136209d6444/language/en/',
  format: ProductFeedFormat.CSV,
};

export const definitions: Partial<ProductFeedDefinition>[] = [
  {
    type: 'root',
    definition: '',
  },
];

/*
  Set Following:
  - productFeed
  - definitions
*/
export const awinMerchant: Partial<Merchant>[] = [
  {
    merchant_id: '58637',
    name: 'Dunleath DE',
  },
];

/*
  Set Following:
  - api
  - merchants
*/
export const awinPartner: Partial<Partner> = {
  partner_id: 'awin_ltd',
  name: 'AWIN Ltd',
  api: [],
  credentials: {},
  merchants: [],
};

//https://export.admitad.com/en/webmaster/websites/2700922/products/export_adv_products/?user=advertah&code=es22q5z8ch&format=xml&currency=&feed_id=25189&last_import=
/*

const x = {
  cid: "97,98,144,129,595,539,147,149,613,626,135,163,168,159,169,161,170,137,171,548,174,183,178,179,175,172,623,139,614,189,194,141,205,198,206,203,208,199,204,201,61,62,72,73,71,74,75,76,77,78,79,63,80,82,64,83,84,85,65,86,88,90,89,91,67,94,33,53,57,58,52,603,60,59,66,128,130,133,212,209,210,211,68,69,213,220,221,70,224,225,226,227,228,229,4,5,10,11,537,15,14,6,22,23,24,25,26,7,30,29,32,619,8,35,618,42,43,9,46,651,49,50,51,634,230,609,538,235,240,239,241,556,245,242,521,576,575,577,579,281,283,285,286,282,287,288,627,173,193,177,196,379,648,181,645,387,646,598,611,391,393,647,631,602,570,600,405,187,411,412,413,414,415,416,417,649,418,419,420,99,100,101,107,110,111,113,114,115,116,118,121,581,624,123,594,125,421,605,604,599,422,530,434,532,428,474,475,476,477,423,608,437,441,446,424,451,448,453,449,452,450,425,455,457,459,460,456,458,426,616,463,464,465,466,467,427,625,473,469,617,470,429,430,481,615,483,484,485,488,529,596,431,432,489,490,361,633,362,366,367,368,371,369,363,372,373,374,377,375,536,535,364,378,380,381,365,383,385,390,392,394,396,397,399,402,404,406,407,540,542,544,546,547,246,558,247,252,559,255,248,256,265,259,632,260,261,262,557,249,266,267,268,269,612,251,250,272,271,561,560,347,348,354,350,349,357,586,588,328,629,338,493,635,495,507,563,564,566,567,569,568",
  fid: "87443,88034,96910",
  rid: "0",
  hasEnhancedFeeds: "0",
  columns: "aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,brand_name,brand_id,colour,product_short_description,specifications,condition,product_model,model_number,dimensions,keywords,promotional_text,product_type,commission_group,merchant_product_category_path,merchant_product_second_category,merchant_product_third_category,rrp_price,saving,savings_percent,base_price,base_price_amount,base_price_text,product_price_old,delivery_restrictions,delivery_weight,warranty,terms_of_contract,delivery_time,in_stock,stock_quantity,valid_from,valid_to,is_for_sale,web_offer,pre_order,stock_status,size_stock_status,size_stock_amount,merchant_thumb_url,large_image,alternate_image,aw_thumb_url,alternate_image_two,alternate_image_three,reviews,average_rating,rating,number_available,ean,isbn,upc,mpn,parent_product_id,product_GTIN,basket_link,display_price,data_feed_id,alternate_image_four",
  format: "csv",
  delimiter: "%2C",
  compression: "gzip",
  adultcontent: "1",
}
*/
