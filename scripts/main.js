import data from "./data.js";
import {searchMovieByTitle, makeBgActive} from "./helpers.js";

class MoviesApp {
    constructor(options) {
        const {root, searchInput, searchForm, yearHandler, yearSubmitter, yearDivId, genreDivId, genreSubmitter, genreHandler} = options;
        this.$tableEl = document.getElementById(root);
        this.$tbodyEl = this.$tableEl.querySelector("tbody");

        this.$searchInput = document.getElementById(searchInput);
        this.$searchForm  = document.getElementById(searchForm);

        this.yearHandler = yearHandler;
        this.$yearSubmitter = document.getElementById(yearSubmitter);
        this.$yearElList = document.getElementById(yearDivId);

        this.$genreElList = document.getElementById(genreDivId);
        this.$genreSubmitter = document.getElementById(genreSubmitter);
        this.genreHandler = genreHandler;
    }
    
    createMovieEl(movie){
        const {image, title, genre, year,id} = movie;
        return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`
    }

    fillTable(){
        const moviesArr = data.map((movie) => {
           return this.createMovieEl(movie)
        }).join("");
        this.$tbodyEl.innerHTML = moviesArr;
    }

    reset(typeArr){
        //Üzerinde seçim ya da işlem yapılmayan filter box resetlenir.
        //Parametre olaran filter box inputlarının türüne göre dizi alınır "checked" olan tüm seçimler "false yapılır."
        typeArr.forEach((type)=>{
            let items = document.querySelectorAll(`input[type=${type}]:checked`);
            items.forEach((item)=>{
                item.checked = false;
            })
        })

        //Seçili olmayan satırların background renkleri resetlenir.
        this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
            item.style.background = "transparent";
        })
    }

    handleSearch(){
        this.$searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.reset(["radio", "checkbox"]);
            const searchValue = this.$searchInput.value;
            //input value'nun boş olup olmadığı kontrol edilir.
            if (searchValue){
                const matchedMovies = data.filter((movie) => {
                    return searchMovieByTitle(movie, searchValue);
                }).forEach(makeBgActive)
                //Search sonrasında input value temizler.
                this.$searchInput.value = "";    
            }
        });
    }

    fillYearFilter(){
      /*Fonksiyon genel amacı: "data.year" içerisindeki tekrarlayan "year" değerlerini ayıklamak ve tekrarlayan elemanların tekrarlama sayılarını bulmaktır. 
        Aynı zamanda "createYearEl" fonksiyonunu çağrılarak ilgili "div"e "year" satırları oluştururlur.*/

        //"data.year" verilerinin tümü map ile "allYearsArr" dizisine kopyalanır.
        const allYearsArr = data.map((obj)=>obj.year)
        let singleYearsArr = [];
        //"singleYearsArr" boş dizisine, "allYearsArr"in ilk elemanı push edilir.
        //"singleYearsArr" dizisi karşılaştırma için kullanılacağından dolayı en az 1 elemana sahip olmalıdır.
        singleYearsArr.push(allYearsArr[0]);
        for(let i=1; i<allYearsArr.length; i++){
            for (let j=0; j<singleYearsArr.length; j++){
                //"allYearsArr" dizisinin elemanı "singleYearsArr" dizisinde var mı diye kontrol edilir.
                //Eğer varsa içteki döngü sonlandırılır ve "allYearsArr"in diğer elemanına geçilir.
                //Eğer yoksa "singleYearsArr"in tüm elemanlarının kontrol edilmediği kontrol edilir.
                //"singleYearsArr"in tüm elemanları kontrol edilince ilgili "allYearsArr" elemanı "singleYearsArr"e push edilir.
                if (allYearsArr[i] === singleYearsArr[j]){
                    break;
                }else if (j === singleYearsArr.length-1){
                    singleYearsArr.push(allYearsArr[i]);
                }
            }
        }
        //Tekrarlayan elemanların tekrarlama sayısı bulunur.
        let repeatNumbers = [];
        singleYearsArr.forEach((singleYear)=>{
            //"allYearsArr" dizisindeki her bir "singleYearsArr" elemanı filter edilir ve her bir elemanın tekrarlama sayısı bulunarak "repeatNumbers" dizisine push edilir.
            const singleRepeat = allYearsArr.filter((allYear)=> singleYear === allYear)
            repeatNumbers.push(singleRepeat.length);
        })
        //Elemanlar "createYearEl"e parametre olarak gönderilerek HTML elementi doldurulur.
        const yearsArr = singleYearsArr.map((year, index) => {
            return this.createYearEl(year, repeatNumbers[index])
         }).join("");
         this.$yearElList.innerHTML = yearsArr;
    }

    createYearEl(year, repeat){    
        //Year değerleri için input ve label oluşturulur. 
        return (`<div class="form-check">
        <input class="form-check-input" type="radio" name="year" id="y${year}" value="${year}">
        <label class="form-check-label" for="y${year}">${year} (${repeat})</label></div>`)
    }

    handleYearFilter(){               
        //"click" eventi tanımlandı.
        this.$yearSubmitter.addEventListener("click", () => {            
            this.reset(["checkbox"]);
            //"input"ların içerisinde "name"i "year" olup kullanıcı tarafından seçilmiş element çağrılır "selectedYear"a atanır.            
            const selectedYear = document.querySelector(`input[name='${this.yearHandler}']:checked`).value
            //"selectedYear" ile her bir "data.year" karşılaştırılır.
            const matchedMovies = data.filter((movie) => {
                return movie.year === selectedYear;
            //filter sonunda oluşan litedeki satırların background rengi değiştirilir.
            }).forEach(makeBgActive)
        });
    }

    fillGenreFilter(){
        /*Bu fonksiyonun çalışma mantığı "fillYearFilter" fonksiyonu ile aynıdır.*/

        //Tekrarlayan elemanlar ayıklanır.
        const allGenresArr = data.map((obj)=>obj.genre)
        let singleGenresArr = [];
        singleGenresArr.push(allGenresArr[0]);
        for(let i=1; i<allGenresArr.length; i++){
            for (let j=0; j<singleGenresArr.length; j++){
                if (allGenresArr[i] === singleGenresArr[j]){
                    break;
                }else if (j === singleGenresArr.length-1){
                    singleGenresArr.push(allGenresArr[i]);
                }
            }
        }

        //Tekrarlayan elemanların tekrarlama sayısı bulunur.
        let repeatNumbers = [];
        singleGenresArr.forEach((singleGenre)=>{
            const singleRepeat = allGenresArr.filter((allGenre)=> singleGenre === allGenre)
            repeatNumbers.push(singleRepeat.length);
        })

        //Elemanlar "createGenreEl"e parametre olarak gönderilerek HTML elementi doldurulur.
        const genresArr = singleGenresArr.map((genre, index) => {
            return this.createGenreEl(genre, repeatNumbers[index])
         }).join("");
         this.$genreElList.innerHTML = genresArr;
    }

    createGenreEl(genre, repeat){
        //Genre değerleri için input ve label oluşturulur.
        return (`<div class="form-check">
        <input class="form-check-input" type="checkbox" name="genre" value="${genre}" id="${genre}">
        <label class="form-check-label" for="${genre}">${genre} (${repeat})</label></div>`)
    }

    handleGenreFilter(){
        //"click" eventi tanımlandı.
        this.$genreSubmitter.addEventListener("click", () => {
            this.reset(["radio"]);
            //"input"ların içerisinde "name"i "genre" olup kullanıcı tarafından seçilmiş tüm elementler çağrılır "selectedGenre"e nodeList olarak atanır.
            const selectedGenre = document.querySelectorAll(`input[name="${this.genreHandler}"]:checked`)
            //"selectedGenre" nodeListinin her bir elemanına for döngüsü ile ulaşılır ve her bir "data.genre" ile karşılaştırılır.
            for (let i=0; i<selectedGenre.length; i++){
                const matchedGenre = data.filter((movie) => {                
                    return movie.genre === selectedGenre[i].value;
                //Her bir filter sonunda oluşan litedeki satırların background rengi değiştirilir.
                }).forEach(makeBgActive)
            }
        })
    }

    init(){
        this.fillTable();
        this.handleSearch();
        this.fillYearFilter();
        this.handleYearFilter();
        this.fillGenreFilter();
        this.handleGenreFilter();       
    }
}

let myMoviesApp = new MoviesApp({
    root: "movies-table",
    searchInput: "searchInput",
    searchForm: "searchForm",
    yearHandler: "year", 
    yearSubmitter: "yearSubmitter",
    yearDivId: "divBox",
    genreDivId: "divBox2",
    genreSubmitter: "genreSubmitter",
    genreHandler: "genre"
});

myMoviesApp.init();
