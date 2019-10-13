# My Recipe API Document

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
| page | Number | Next page number|
| totalPage | Number | Total pages |

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

`Hot Recipes Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| id | Number | Recipe id |
| title | String | Recipe title |
| image | String | Recipe image |
| likes | Number | Like count |

* `Hot Keywords Object`

| Field | Type | Description |
| :---: | :---: | :--- |
| searchItem | String | Search keywords |
| category | String | Dish Name or Ingredient |
| COUNT(*) | Number | Number of searchs |

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

* `Green Price Trace List`

| Field | Type | Description |
| :---: | :---: | :--- |
| 'food name' | Array of String | Vege / Fruit id |
| 'new' + 'food name' | Array of String | Category of searched food |

* `User Sign Up / Sign In Object`

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
| page | Number | Next page number |
| totalPage | Number | Total pages |


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

