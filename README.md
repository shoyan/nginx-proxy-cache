# nginx-proxy-cache

Nginxを使ったプロキシサーバのサンプルです。プロキシした際にファイルをキャッシュします。

Node.jsのアプリサーバの前にNginxがプロキシしています。

プロキシ(Nginx) ====> アプリ(Node.js)

## Usage

### 起動方法

dockerで起動します。

```
$ docker-compose up
Starting proxycachesample_app_1 ...
Starting proxycachesample_app_1 ... done
Starting proxycachesample_proxy_1 ...
Starting proxycachesample_proxy_1 ... done
Attaching to proxycachesample_app_1, proxycachesample_proxy_1
app_1    | Server running at http://localhost:8081/
```

### 停止方法

```
$ docker-compose stop
```

### エンドポイント

プロキシのエンドポイントは次のようになります。

```
$ curl http://localhost:8080  -w "%{time_total}"
Hello World
0.003797
```

直接アプリサーバにアクセスすることも可能です。アプリサーバのレスポンスは1秒程度かかります。

```
$ curl http://localhost:8081 -w "%{time_total}"
Hello World
1.009103
```

## abを使ってベンチマークをとる

abでベンチマークをとります。同時アクセス数10で1000アクセスしています。

* 処理時間: 1.089秒
* 秒間に処理できるリクエスト: 918リクエスト

```
$ ab -n 1000 -c 10 http://localhost:8080/
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests

Server Software:        nginx/1.13.9
Server Hostname:        localhost
Server Port:            8080

Document Path:          /
Document Length:        12 bytes

Concurrency Level:      10
Time taken for tests:   1.089 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      155000 bytes
HTML transferred:       12000 bytes
Requests per second:    918.59 [#/sec] (mean)
Time per request:       10.886 [ms] (mean)
Time per request:       1.089 [ms] (mean, across all concurrent requests)
Transfer rate:          139.04 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.4      0       3
Processing:     2   10   5.0     10      42
Waiting:        2    9   4.6      9      41
Total:          2   11   5.0     10      42

Percentage of the requests served within a certain time (ms)
  50%     10
  66%     12
  75%     13
  80%     13
  90%     16
  95%     19
  98%     25
  99%     32
 100%     42 (longest request)
```

プロキシを仲介せずに直接アプリサーバにアクセスすると低速なことが確認できます。

* 処理時間: 101.323秒
* 秒間に処理できるリクエスト: 9リクエスト

```
⇒  ab -n 1000 -c 10 http://localhost:8081/
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:
Server Hostname:        localhost
Server Port:            8081

Document Path:          /
Document Length:        12 bytes

Concurrency Level:      10
Time taken for tests:   101.323 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      113000 bytes
HTML transferred:       12000 bytes
Requests per second:    9.87 [#/sec] (mean)
Time per request:       1013.235 [ms] (mean)
Time per request:       101.323 [ms] (mean, across all concurrent requests)
Transfer rate:          1.09 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   1.0      0      12
Processing:  1001 1012   7.1   1011    1058
Waiting:     1001 1009   6.4   1008    1057
Total:       1001 1013   7.2   1012    1060

Percentage of the requests served within a certain time (ms)
  50%   1012
  66%   1014
  75%   1016
  80%   1017
  90%   1020
  95%   1023
  98%   1031
  99%   1057
 100%   1060 (longest request)
```

## まとめ

低速なアプリサーバの前にプロキシを置いてキャッシュすると処理が高速に行えることが確認できました。
