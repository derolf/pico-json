# Benchmark

## https://raw.githubusercontent.com/airframesio/data/f4612c9d6387d54b13be62d3b95733a49b9555b4/json/noaa/tafs.json

Averaging over 10 repetitions

### Without compression

| name      | length  | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| --------- | ------- | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json | 1323808 | 41       | 24162          | 40               | 15358          | 20               |
| msgpack   | 2613449 | 80       | 24126          | 40               | 36545          | 47               |
| json      | 3024183 | 93       | 18561          | 31               | 20665          | 27               |
| bson      | 3264083 | 100      | 60178          | 100              | 77785          | 100              |

### With deflate

| name              | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ----------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json deflate | 218834 | 70       | 54608          | 48               | 20874          | 26               |
| json deflate      | 247804 | 79       | 52471          | 46               | 26502          | 33               |
| msgpack deflate   | 260027 | 83       | 59553          | 52               | 40563          | 50               |
| bson deflate      | 314826 | 100      | 114290         | 100              | 81526          | 100              |

### With lz4

| name          | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json lz4 | 402466 | 73       | 18308          | 28               | 18993          | 23               |
| msgpack lz4   | 459282 | 83       | 28260          | 43               | 40858          | 50               |
| json lz4      | 473437 | 86       | 23501          | 36               | 25183          | 31               |
| bson lz4      | 550356 | 100      | 66066          | 100              | 82264          | 100              |

## https://raw.githubusercontent.com/sveltejs/svelte/master/package-lock.json

Averaging over 10 repetitions

### Without compression

| name      | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| --------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json | 205773 | 71       | 2814           | 65               | 1982           | 35               |
| msgpack   | 257854 | 89       | 2141           | 49               | 3840           | 68               |
| json      | 287454 | 99       | 1572           | 36               | 1801           | 32               |
| bson      | 291268 | 100      | 4347           | 100              | 5608           | 100              |

### With deflate

| name              | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ----------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json deflate | 90606  | 92       | 8938           | 71               | 4156           | 66               |
| json deflate      | 92499  | 93       | 8866           | 70               | 2888           | 46               |
| msgpack deflate   | 95691  | 97       | 9262           | 73               | 4705           | 74               |
| bson deflate      | 99008  | 100      | 12668          | 100              | 6331           | 100              |

### With lz4

| name          | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json lz4 | 123949 | 90       | 2795           | 52               | 3299           | 49               |
| json lz4      | 129810 | 94       | 2316           | 43               | 3201           | 47               |
| msgpack lz4   | 133220 | 96       | 3133           | 58               | 5114           | 76               |
| bson lz4      | 138445 | 100      | 5369           | 100              | 6770           | 100              |

## https://raw.githubusercontent.com/google-map-react/google-map-react-examples/master/public/places.json

Averaging over 100 repetitions

### Without compression

| name      | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| --------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json | 17745  | 73       | 219            | 59               | 131            | 34               |
| msgpack   | 21578  | 89       | 173            | 47               | 229            | 59               |
| json      | 24324  | 100      | 157            | 42               | 227            | 59               |
| bson      | 24356  | 100      | 369            | 100              | 386            | 100              |

### With deflate

| name              | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ----------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| json deflate      | 9836   | 92       | 575            | 70               | 252            | 50               |
| pico-json deflate | 10112  | 95       | 662            | 81               | 226            | 45               |
| msgpack deflate   | 10298  | 96       | 585            | 71               | 347            | 69               |
| bson deflate      | 10675  | 100      | 818            | 100              | 505            | 100              |

### With lz4

| name          | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json lz4 | 12597  | 93       | 322            | 64               | 492            | 46               |
| msgpack lz4   | 12836  | 94       | 371            | 74               | 878            | 82               |
| json lz4      | 13043  | 96       | 390            | 78               | 567            | 53               |
| bson lz4      | 13590  | 100      | 501            | 100              | 1077           | 100              |

## https://jsonplaceholder.typicode.com/posts

Averaging over 100 repetitions

### Without compression

| name      | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| --------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json | 21309  | 85       | 202            | 71               | 149            | 49               |
| msgpack   | 22788  | 90       | 175            | 61               | 256            | 84               |
| json      | 24519  | 97       | 128            | 45               | 75             | 25               |
| bson      | 25211  | 100      | 286            | 100              | 303            | 100              |

### With deflate

| name              | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ----------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json deflate | 6720   | 85       | 972            | 81               | 244            | 59               |
| json deflate      | 6902   | 87       | 899            | 75               | 182            | 44               |
| msgpack deflate   | 7086   | 90       | 1025           | 85               | 365            | 88               |
| bson deflate      | 7905   | 100      | 1201           | 100              | 416            | 100              |

### With lz4

| name          | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json lz4 | 10717  | 85       | 242            | 61               | 532            | 54               |
| json lz4      | 11407  | 91       | 298            | 75               | 455            | 46               |
| msgpack lz4   | 11425  | 91       | 316            | 80               | 980            | 100              |
| bson lz4      | 12571  | 100      | 397            | 100              | 714            | 73               |

## https://jsonplaceholder.typicode.com/comments

Averaging over 100 repetitions

### Without compression

| name      | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| --------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json | 120115 | 84       | 1163           | 67               | 788            | 41               |
| msgpack   | 128865 | 90       | 974            | 56               | 1395           | 73               |
| json      | 139744 | 98       | 765            | 44               | 519            | 27               |
| bson      | 143286 | 100      | 1741           | 100              | 1914           | 100              |

### With deflate

| name              | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ----------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| json deflate      | 39590  | 87       | 7014           | 75               | 1132           | 43               |
| pico-json deflate | 39862  | 88       | 7109           | 76               | 1304           | 49               |
| msgpack deflate   | 41138  | 91       | 7754           | 82               | 1951           | 74               |
| bson deflate      | 45344  | 100      | 9406           | 100              | 2636           | 100              |

### With lz4

| name          | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json lz4 | 59568  | 87       | 1487           | 60               | 1663           | 56               |
| json lz4      | 61060  | 89       | 1468           | 59               | 1214           | 41               |
| msgpack lz4   | 62855  | 91       | 1650           | 66               | 2960           | 100              |
| bson lz4      | 68812  | 100      | 2489           | 100              | 2799           | 95               |

## https://jsonplaceholder.typicode.com/albums

Averaging over 100 repetitions

### Without compression

| name      | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| --------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json | 4630   | 59       | 111            | 29               | 40             | 18               |
| msgpack   | 5791   | 74       | 53             | 14               | 118            | 54               |
| json      | 6932   | 89       | 59             | 15               | 56             | 26               |
| bson      | 7824   | 100      | 381            | 100              | 219            | 100              |

### With deflate

| name              | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ----------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json deflate | 1753   | 67       | 287            | 63               | 134            | 55               |
| json deflate      | 1925   | 73       | 197            | 43               | 57             | 23               |
| msgpack deflate   | 2070   | 79       | 231            | 51               | 97             | 40               |
| bson deflate      | 2630   | 100      | 456            | 100              | 242            | 100              |

### With lz4

| name          | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json lz4 | 2660   | 64       | 96             | 37               | 344            | 61               |
| json lz4      | 3074   | 74       | 168            | 64               | 336            | 60               |
| msgpack lz4   | 3202   | 77       | 79             | 30               | 427            | 76               |
| bson lz4      | 4168   | 100      | 264            | 100              | 561            | 100              |

## https://jsonplaceholder.typicode.com/photos

Averaging over 100 repetitions

### Without compression

| name      | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| --------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json | 662051 | 70       | 8006           | 48               | 5052           | 29               |
| msgpack   | 800895 | 85       | 6846           | 41               | 8654           | 51               |
| json      | 891471 | 95       | 4484           | 27               | 3264           | 19               |
| bson      | 941872 | 100      | 16791          | 100              | 17127          | 100              |

### With deflate

| name              | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ----------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json deflate | 127158 | 77       | 18251          | 47               | 7238           | 37               |
| json deflate      | 128711 | 78       | 20478          | 53               | 5652           | 29               |
| msgpack deflate   | 136574 | 83       | 24928          | 64               | 11262          | 57               |
| bson deflate      | 164522 | 100      | 38914          | 100              | 19813          | 100              |

### With lz4

| name          | length | % length | encodeTime[µS] | % encodeTime[µS] | decodeTime[µS] | % decodeTime[µS] |
| ------------- | ------ | -------- | -------------- | ---------------- | -------------- | ---------------- |
| pico-json lz4 | 188114 | 75       | 8051           | 42               | 7335           | 36               |
| json lz4      | 199774 | 79       | 7152           | 37               | 5310           | 26               |
| msgpack lz4   | 209815 | 83       | 9221           | 48               | 11899          | 59               |
| bson lz4      | 252025 | 100      | 19363          | 100              | 20286          | 100              |
