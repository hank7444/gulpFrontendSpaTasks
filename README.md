gulpFrontendTasks
===================

利用gulp合併與壓縮js, css, html與圖片

總共有以下執行模式: 

* `default`: 監聽sass/, 並在每次儲存自動轉成css檔案
* `livereload`: 同default, 但多了browser-sync模組, 在每次儲存sass時, 會自動重新整理瀏覽器中，網址為:localhost:3000/html.*.html的頁面
* `dist`: 壓縮，合併js, css. html部分請依照需求選擇要壓縮或是直接複製到dist/中
* `dist-noncon`: 只壓縮js, css, html部分請依照需求選擇要壓縮或是直接複製到dist/中
* `dist-img`: 結合`dist`與壓縮圖片, 通常用於第一次壓縮圖片(如果有新圖片, 就要重新執行以便重新壓縮圖片)
* `dist-noncon-img`: 結合`dist-noncon`與壓縮圖片, 同`dist-img`用法

##資料夾結構
+ css/
+ html/
+ img/
+ sass/

gulp會根據html/index.html\(預設\)的\<link>與\<script>的css與js連結, 抓到對應js&css檔案,
如果要修改讀取的html檔案名稱, 請到gulpfile.js中修改變數`indexPath`



##Usage

### step1: download node modules
```
npm install
```

### step2: execute grunt

```
gulp // or "gulp livereload" or "gulp dist or etc..."

```

### step3: use & enjoy it! :)
如果為livereload模式, <br>
預設的網址為: localhost:3000, <br>
瀏覽器會自動重新整理瀏覽器中，網址為:localhost:3000/html.*.html的頁面

 
##License
Licensed under the MIT License
 
##Authors
Copyright(c) 2014 Hank Kuo <<hank7444@gmail.com>>
