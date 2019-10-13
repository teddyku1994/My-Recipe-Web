# API Documentation

### Host Name

bookncode.com

### API Version

1.0

### Main Response Object

* `Recipe Search Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Recipe id |
| title | String | Recipe title |
| image | String | Recipe image |
| likes | Number | Recipe likes |
| user_id | Number | Recipe creator |

* `Hot Keywords Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| searchItem | String | Search keywords |
| category | String | Dish Name or Ingredient |
| COUNT(*) | Number | Number of searchs |

* `Recipes Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Recipe id |
| title | String | Recipe title |
| mainImage | String | Recipe main image |
| likes | Number | Recipe likes |
| user_id | Number | Recipe creator |
| ingredient | Array of String | Recipe ingredients |
| amount | Array of String | Recipe ingredients quantity |
| step | Array of String | Recipe steps |
| image | Array of String | Recipe images for steps |

* `Hot Recipes Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Recipe id |
| title | String | Recipe title |
| image | String | Recipe image |
| likes | Number | Like count |

* `Nutrient List Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| name | Array of String | List of food name |

* `Nutrient Level Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Nutrient id |
| category | String | Category of searched food |
| name | String | Name of searched food |
| calories | Number | Nutrient info |
| water | Number | Nutrient info |
| protein | Number | Nutrient info |
| totalFat | Number | Nutrient info |
| saturatedFat | Number | Nutrient infos |
| carbohydrate | Number | Nutrient info |
| dietaryFiber | Number | Nutrient info |
| sugar | Number | Nutrient info |
| sodium | Number | Nutrient info |
| calcium | Number | Nutrient info |
| vitE | Number | Nutrient info |
| vitB2 | Number | Nutrient info |
| vitC | Number | Nutrient info |

* `Green Price Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| title | String | Vege / Fruit id |
| price | Array of String | Category of searched food |
| image | String | Name of searched food |
| others | Array of String | Relevant search names |
| otherLinks | Array of String | Links of relevant search names |
| cacheLink | String | Link for searched food |
| exist | Number | 0: not in user trace list, 1: in user trace list |

* `Green Price Trace List Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| 'food name' | Array of String | Vege / Fruit id |
| 'new' + 'food name' | Array of String | Category of searched food |

* `User Sign Up Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| accessToken | String | Access token |

* `User Sign In Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| accessToken | String | Access token |
| dp | String | Profile Display picture |

* `User Profile Object`

  * `Basic Info Object`    
    
  | Field | Type | Description |
  | :---: | :---: | :--- |
  | id | Number | User id |
  | name | String | Name of user |
  | email | String | User email |
  | image | Number | Profile display picture |

  * `User Favorites Object`    
    
  | Field | Type | Description |
  | :---: | :---: | :--- |
  | id | Number | Recipe id |
  | title | String | Recipe title |
  | image | String | Recipe image |



* `User Recipe Object`

  * `Recipe List Object`    
    
  | Field | Type | Description |
  | :---: | :---: | :--- |
  | id | Number | Recipe id |
  | title | String | Recipe title |
  
  * `User Recipe Object`    
    
  | Field | Type | Description |
  | :---: | :---: | :--- |
  | id | Number | Recipe id |
  | title | String | Recipe title |
  | mainImage | String | Recipe main image |
  | likes | Number | Recipe likes |
  | user_id | Number | Recipe creator |
  | ingredient | Array of String | Recipe ingredients |
  | amount | Array of String | Recipe ingredients quantity |
  | step | Array of String | Recipe steps |
  | image | Array of String | Recipe images for steps |

---

### Recipe Search Object

* **End Point:** `/search`

* **Method:** `GET`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| dishName | String | Required |
| ingredient | String | Required |
| page | Number | Page Required |


* **Request Example:**

`https://[HOST_NAME]/api/1.0/search?dishName=牛肉麵&page=0`  
`https://[HOST_NAME]/api/1.0/search?ingredient=醬油%2C雞&page=0`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Recipe Search Object` |
| page (optional) | Number | Next page number |
| totalPage (optional) | Number | Total pages |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "id": 8,
      "title": "咖哩牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115725/cb115725_1566803028_c.jpg",
      "likes": 1,
      "user_id": null
    },
    {
      "id": 9,
      "title": "沙茶牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115708/cb115708_1566572968_c.jpg",
      "likes": 1,
      "user_id": null
    },
    {
      "id": 10,
      "title": "牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/114280/cb114280_1533541761_c.jpeg",
      "likes": null,
      "user_id": null
    },
    {
      "id": 12,
      "title": "家常牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/111796/cb111796_1479216774_c.jpg",
      "likes": null,
      "user_id": null
    },
    {
      "id": 13,
      "title": "沙茶牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/111756/cb111756_1478774752_c.jpg",
      "likes": null,
      "user_id": null
    },
    {
      "id": 14,
      "title": "川味牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/111732/cb111732_1478598657_c.jpg",
      "likes": 1,
      "user_id": null
    }
  ],
  "page": 1,
  "totalPage": 1
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Invalid Search"
}
```

---

### Hot Keywords Object

* **End Point:** `/search/hotKeywords`

* **Method:** `GET`

* **Request Example:**

`https://[HOST_NAME]/api/1.0/search/hotKeywords`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Hot Keywords Object` |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "searchItem": "牛肉麵",
      "category": "dishName",
      "COUNT(*)": 7
    },
    {
      "searchItem": "牛肉",
      "category": "ingredient",
      "COUNT(*)": 7
    },
    {
      "searchItem": "醬油",
      "category": "ingredient",
      "COUNT(*)": 6
    },
    {
      "searchItem": "牛肉",
      "category": "dishName",
      "COUNT(*)": 5
    },
    {
      "searchItem": "豬腳",
      "category": "dishName",
      "COUNT(*)": 4
    },
    {
      "searchItem": "雞肉",
      "category": "ingredient",
      "COUNT(*)": 4
    }
  ]
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Invalid Token"
}
```

---

### Recipe Object

* **End Point:** `/recipe`

* **Method:** `GET`

* **Query Parameters**

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Required |

* **Request Example:**

`https://[HOST_NAME]/api/1.0/recipe?id=28`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Recipe Object` |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "id": 28,
      "title": "懷舊茶葉蛋★okane☆",
      "mainImage": "https://fooding-aws.hmgcdn.com/images/cookbooks/115230/cb115230_1556786549_c.jpg",
      "likes": null,
      "userId": null,
      "ingredient": [
        "#水煮_雞蛋",
        "#水煮_鹽",
        "#水煮_冷水",
        "滷包",
        "茶包",
        "米酒",
        "醬油",
        "糖",
        "內鍋水",
        "外鍋水"
      ],
      "amount": [
        "8粒",
        "5g",
        "適量",
        "1包",
        "1包",
        "50ml",
        "50ml",
        "10g",
        "250ml",
        "3杯"
      ],
      "step": [
        "冷水淹過雞蛋，注意是「冷水」和雞蛋在同一個起跑線一起煮，至於雞蛋是否室溫？或剛從冰箱拿出來？則沒差，但記得放一匙鹽和武火一起煮。\n水滾即可熄火，上鍋蓋慢慢悶熟。這空檔可以去找些事做，比如逛逛我的YouTube (https://reurl.cc/dXXOq)",
        "一兩個小時後，差不多手可以貼鍋邊的溫度，將水瀝乾，每個雞蛋360°在桌面上敲成蜘蛛網狀。\n滷包和茶包置於鍋底部，排列所有雞蛋，這次水煮雞蛋換泡醬油浴池，水量多寡依鍋子大小酌量增減，調味料也須一併調整。\n外鍋3杯水，約煮一小時；我又在外鍋放了3杯水，所以是第二次煮完的狀態。",
        "燒燙燙~燙燙燒，練鐵沙掌沒？沒練的話，像我就等放涼再剝。\n建議含滷汁一同上保鮮盒進冰箱（滷包和茶包可捨棄），再多冰個一兩天更入味！"
      ],
      "image": [
        "https://fooding-aws.hmgcdn.com/images/cookbooks/115230/c115230_1556786765_c.jpg",
        "https://fooding-aws.hmgcdn.com/images/cookbooks/115230/c115230_1556786766_c.jpg",
        "https://fooding-aws.hmgcdn.com/images/cookbooks/115230/c115230_1556786767_c.jpg"
      ]
    }
  ]
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Bad Request"
}
```

---

### Hot Recipes Object

* **End Point:** `/recipe/hots`

* **Method:** `GET`

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Hot Recipes Object` |


* **Request Example:**

`https://[HOST_NAME]/api/1.0/recipe/hots`

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "id": 1,
      "title": "霜降牛排★okane☆",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115803/cb115803_1567986314_c.jpg",
      "likes": 1
    },
    {
      "id": 2,
      "title": "嫩煎沙朗牛排",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115629/cb115629_1565007249_c.jpg",
      "likes": 1
    },
    {
      "id": 3,
      "title": "大蒜香煎牛排",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/114775/cb114775_1545180439_c.jpg",
      "likes": 1
    },
    {
      "id": 5,
      "title": "嫩煎牛排♥（電鍋版的陽春舒肥法）",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/112672/cb112672_1494077244_c.jpg",
      "likes": 1
    },
    {
      "id": 7,
      "title": "香蒜牛排",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/110333/cb110333_1461138732_c.jpg",
      "likes": 1
    },
    {
      "id": 8,
      "title": "咖哩牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115725/cb115725_1566803028_c.jpg",
      "likes": 1
    },
    {
      "id": 9,
      "title": "沙茶牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115708/cb115708_1566572968_c.jpg",
      "likes": 1
    },
    {
      "id": 14,
      "title": "川味牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/111732/cb111732_1478598657_c.jpg",
      "likes": 1
    },
    {
      "id": 15,
      "title": "紅燒牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/111707/cb111707_1478359038_c.JPG",
      "likes": 1
    },
    {
      "id": 192,
      "title": "香滷豬腳",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/114176/cb114176_1530589931_c.jpeg",
      "likes": 1
    },
    ...
  ]
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Bad Request"
}
```

---

### Nutrient List Object

* **End Point:** `/nutrient/list`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :--- |
| keyword | String | Required |

* **Request Body Example:**

``` javascript
{
  "keyword": "雞"
}
```

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Nutrient List Object` |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "names": [
        "全雞平均值",
        "雞蛋麵",
        "雞絲麵",
        "雞腿菇",
        "雞腿菇(乾)",
        "雞排(肉雞)",
        "雞絞肉",
        "雞排(土雞)",
        "雞排平均值"
      ]
    }
  ]
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Bad Request"
}
```

---

### Nutrient Level Object

* **End Point:** `/nutrient/name`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :--- |
| keyword | String | Required |

* **Request Body Example:**

``` javascript
{
  "nutName": "全雞平均值"
}
```

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Nutrient Level Object` |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "id": 960,
      "category": "肉類",
      "name": "全雞平均值",
      "calories": 216,
      "water": 67,
      "protein": 18,
      "totalFat": 16,
      "saturatedFat": 4,
      "carbohydrate": 0,
      "dietaryFiber": 0,
      "sugar": 0,
      "sodium": 52,
      "calcium": 6,
      "vitE": 0,
      "vitB2": 0,
      "vitC": 6
    }
  ]
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Bad Request"
}
```

---

### Green Price Object

* **End Point:** `/marketPrice/greens`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |
| Autherization | String | `Bearer` Access Token |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :--- |
| keywords | String | Required |

* **Request Body Example:**

``` javascript
{
  "keywords": "蘋果"
}
```

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Green Price` |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "title": "蘋果-其他(進口)",
      "price": [
        " 143.4",
        "430"
      ],
      "image": "https://www.twfood.cc/img/code/X09/_.jpg",
      "others": [
        "青蘋果-青蘋果",
        "蘋果-五爪",
        "蘋果-五爪(進口)",
        "蘋果-秋香",
        "蘋果-秋香(進口)",
        "蘋果-惠",
        "蘋果-惠(進口)",
        "蘋果-金冠",
        "蘋果-金冠(進口)",
        "蘋果-紅玉"
      ],
      "otherLinks": [
        "/flower/FY080/青蘋果-青蘋果",
        "/fruit/X1/蘋果-五爪",
        "/fruit/X19/蘋果-五爪(進口)",
        "/fruit/X2/蘋果-秋香",
        "/fruit/X29/蘋果-秋香(進口)",
        "/fruit/X3/蘋果-惠",
        "/fruit/X39/蘋果-惠(進口)",
        "/fruit/X4/蘋果-金冠",
        "/fruit/X49/蘋果-金冠(進口)",
        "/fruit/X5/蘋果-紅玉"
      ],
      "cacheLink": "/fruit/X09/蘋果-其他(進口)",
      "exist": 0
    }
  ]
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Bad Request"
}
```

---

### Green Price Trace List Object

* **End Point:** `/marketPrice/tracelist`

* **Method:** `GET`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Autherization | String | `Bearer` Access Token |

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Green Price Trace List Object` |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "蘋果-其他(進口)": [
        "143.4",
        "430",
        "0"
      ],
      "甘藍-初秋(高麗菜,捲心菜)": [
        "19.5",
        "39",
        "0"
      ],
      "水蜜桃-進口": [
        "108.8",
        "326",
        "0"
      ],
      "番石榴-珍珠芭(芭樂)": [
        "40.5",
        "122",
        "0"
      ],
      "蘆筍-白蘆筍": [
        "59.9",
        "120",
        "0"
      ]
  },
  {
      "new蘋果-其他(進口)": [
        "143.4",
        "430"
      ],
      "new甘藍-初秋(高麗菜,捲心菜)": [
        "19.5",
        "39"
      ],
      "new水蜜桃-進口": [
        "108.8",
        "326"
      ],
      "new番石榴-珍珠芭(芭樂)": [
        "40.5",
        "122"
      ],
      "new蘆筍-白蘆筍": [
        "59.9",
        "120"
      ]
    }
  ]
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Bad Request"
}
```

---

### User Sign Up Object

* **End Point:** `/user/signup`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :--- |
| name | String | Required |
| email | String | Required |
| pw | String | Required (length <= 8>) |
| confirmPw | String | Required |

* **Request Body Example:**

``` javascript
{
  "name": "test",
  "email": "test@example.com",
  "pw": "12345678",
  "confirmPw": "12345678"
}
```

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `User Sign Up Object` |

* **Success Response Example:**

``` javascript
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCIGIkpXVCJ9.eyJ1c2VySWQiOjE1LCJpYXQiOjE1NzA5NzS3MTYsImV4cCI6MTU3MTA1ATExNn0.ChZFcmpiftkrGGVzWzjSI-ykYqbs1W65FnUJmYFGkU8"
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Bad Request"
}
```

---

### User Sign In Object

* **End Point:** `/user/signin`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :--- |
| provider | String | Required |
| email | String | Required |
| pw | String | Required |

* **Request Body Example:**

``` javascript
{
  "provider": "native",
  "email": "test@example.com",
  "pw": "12345678"
}
```
or
``` javascript
{
  "provider": "facebook",
  "accessToken": "Facebook access token"
}
``` 

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `User Sign In Object` |

* **Success Response Example:**

``` javascript
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCIGIkpXVCJ9.eyJ1c2VySWQiOjE1LCJpYXQiOjE1NzA5NzS3MTYsImV4cCI6MTU3MTA1ATExNn0.ChZFcmpiftkrGGVzWzjSI-ykYqbs1W65FnUJmYFGkU8"
  "dp": "https://d1lpqhjzd6rmjw.cloudfront.net/profile/12/15709480554576811093-stunning-anime-scenery-wallpaper.jpg"
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Bad Request"
}
```

---

### User Profile Object

* **End Point:** `/user/profile`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |
| Autherization | String | `Bearer` Access Token |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :--- |
| status | String | Required |
| page | Number | Required for favInfo |


* **Request Body Example:**

``` javascript
{
  "status": "basicInfo"
}
```
or
``` javascript
{
  "status": "favInfo",
  "page": 0
}
``` 

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Basic Info Object` |
or
| Type | Description |
| :---: | :--- |
| data | Array of `User Favorites Object` |
| page (optional) | Number | Next page number |
| totalPage (optional) | Number | Total pages |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "id": 12,
      "name": "test",
      "email": "test@test.com",
      "image": "https://d1lpqhjzd6rmjw.cloudfront.net/profile/12/15709480554576811093-stunning-anime-scenery-wallpaper.jpg"
    }
  ]
}
```
or
``` javascript
{
  "data": [
    {
      "id": 1,
      "title": "霜降牛排★okane☆",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115803/cb115803_1567986314_c.jpg"
    },
    {
      "id": 2,
      "title": "嫩煎沙朗牛排",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115629/cb115629_1565007249_c.jpg"
    },
    {
      "id": 5,
      "title": "嫩煎牛排♥（電鍋版的陽春舒肥法）",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/112672/cb112672_1494077244_c.jpg"
    },
    {
      "id": 9,
      "title": "沙茶牛肉麵",
      "image": "https://fooding-aws.hmgcdn.com/images/cookbooks/115708/cb115708_1566572968_c.jpg"
    }
  ],
  "page": 1,
  "totalPage": 2
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Invalid Token"
}
```

---

### User Recipe Object

* **End Point:** `/user/recipe`

* **Method:** `POST`

* **Request Headers:**

| Field | Type | Description |
| :---: | :---: | :---: |
| Content-Type | String | Only accept `application/json` |
| Autherization | String | `Bearer` Access Token |

* **Request Body**

| Field | Type | Description |
| :---: | :---: | :--- |
| status | String | Required |
| recipeId | Number | Required for update |

* **Request Body Example:**

``` javascript
{
  "status": "list"
}
```
or
``` javascript
{
  "status": "update",
  "recipeId": 221
}
``` 

* **Success Response: 200**

| Type | Description |
| :---: | :--- |
| data | Array of `Recipe List Object` |
or
| Type | Description |
| :---: | :--- |
| data | Array of `User Recipe Object` |

* **Success Response Example:**

``` javascript
{
  "data": [
    {
      "id": 221,
      "title": "test"
    },
    {
      "id": 222,
      "title": "test2"
    }
  ]
}
```
or
``` javascript
{
  "data": [
    {
      "id": 221,
      "title": "test",
      "mainImage": "https://d1lpqhjzd6rmjw.cloudfront.net/recipes/12/1570950421243Buffalo-Cauliflower-Tacos-with-Avocado-Crema-Recipe.jpg",
      "likes": null,
      "userId": 12,
      "ingredient": [
        "test",
        "test"
      ],
      "amount": [
        "test",
        "test"
      ],
      "step": [
        "test",
        "test"
      ],
      "image": [
        "https://d1lpqhjzd6rmjw.cloudfront.net/recipes/12/1570950421248Buffalo-Cauliflower-Tacos-with-Avocado-Crema-Recipe.jpg",
        "https://d1lpqhjzd6rmjw.cloudfront.net/recipes/12/1570950421273Buffalo-Cauliflower-Tacos-with-Avocado-Crema-Recipe.jpg"
      ]
    }
  ]
}
```

* **Error Response: 400**

| Field | Type | Description |
| :---: | :---: | :---: |
| error | String | Error message |

* **Error Response Example:**
``` javascript
{
"error": "Invalid Token"
}
```