var valid_test;

function validiraj(){
    valid_test=true;
    everything_filled();
    valid_name();
    valid_tags();

    var id=localStorage.getItem("id");
    console.log(id);
   if(valid_test == true && id!==null){
      objavi_post(id);
    } else{
      console.log("Post se ne objavljuje");
    }
  }

  function everything_filled(){
      var entries = document.getElementById("forma");
      if(entries.ime_jela_input.value.length == 0){
        valid_test = false;
        document.getElementById("EmptyNameWarning").classList.remove("d-none");
      } else document.getElementById("EmptyNameWarning").classList.add("d-none");

      if(entries.opis_jela_input.value.length == 0){
        valid_test = false;
        document.getElementById("EmptyRecipeWarning").classList.remove("d-none");
      } else document.getElementById("EmptyRecipeWarning").classList.add("d-none");

      if(entries.sastojci_jela_input.value.length == 0){
        valid_test = false;
        document.getElementById("EmptySastojciWarning").classList.remove("d-none");
      } else document.getElementById("EmptySastojciWarning").classList.add("d-none");

      if(entries.vreme_jela_input.value.length == 0){
        valid_test = false;
        document.getElementById("EmptyTimeWarning").classList.remove("d-none");
      } else document.getElementById("EmptyTimeWarning").classList.add("d-none");
      
      if(entries.tagovi_jela_input.value.length == 0){
        valid_test = false;
        document.getElementById("EmptyTagsWarning").classList.remove("d-none");
      } else document.getElementById("EmptyTagsWarning").classList.add("d-none");
      
  }

  function valid_name(){
    var pattern = /^[A-Za-z ]{1,100}$/;
    var tekst = document.getElementById("forma").ime_jela_input.value;
    var test = tekst.match(pattern);

    if (test == null) {
        document.getElementById("NameWarning").classList.remove("d-none");
        valid_test = false;
    } else{
      console.log("validirano ime recepta...");
      document.getElementById("NameWarning").classList.add("d-none");
    }
  }

  function valid_tags(){
    var pattern = /^[A-Za-z, ]{1,100}$/;
    var tekst = document.getElementById("forma").tagovi_jela_input.value;
    var test = tekst.match(pattern);

    if (test == null) {
        document.getElementById("TagWarning").classList.remove("d-none");
        valid_test = false;
    } else{
      console.log("validirani tagovi recepta...");
      document.getElementById("TagWarning").classList.add("d-none");
    }
  }
  /*Upload.js*/
  var link;

function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}

function addImg(ele, content) {
    var myDIV = document.querySelector(ele);
    var newContent = document.createElement('div');
    newContent.innerHTML = content;

    while (newContent.firstChild) {
        myDIV.appendChild(newContent.firstChild);
    }
}

var feedback = function(res) {
    reportInfo(res, true);
    if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
        document.querySelector('.status').classList.add('bg-success');
        var content =
            'Image : ' + '<br><input class="image-url" value=\"' + get_link + '\"/>' 
             + '<img class="img" alt="Imgur-Upload" src=\"' + get_link + '\"/>';
        addImg('.status', content);
        link = get_link;
    }
};

new Imgur({
    clientid: 'a08fd223eb9d597', //You can change this ClientID
    callback: feedback
});

//Punjenje baze

async function objavi_post(id){

  var entries = document.getElementById("forma");
  var ime = entries.ime_jela_input.value;
  var opis = entries.opis_jela_input.value;
  var sastojci = entries.sastojci_jela_input.value.split(",");
  var vreme = entries.vreme_jela_input.value;
  var tagovi = entries.tagovi_jela_input.value.split(",");
  var listaSastojaka=[Object];

  for (var i = 0, len = sastojci.length; i < len; i++) {
    sastojci[i] = sastojci[i].trim();
    var x=sastojci[i].split(' ');
    x[0]=x[0].trim();
    x[1]=x[1].trim();
    listaSastojaka[i]={
      imeSastojka:x[1],
      kolicinaSastojka:x[0],
    };
  }

  for (var i = 0, len = tagovi.length; i < len; i++) {
    tagovi[i] = tagovi[i].trim();
  }

  var tezina = document.querySelector('input[name="tezina"]:checked').value;
  switch(tezina){
    case "Složeno":
      tezina = 3;
    break;
    
    case "Srednje":
      tezina = 2;
    break;

    case "Prosto":
      tezina = 1;
    break;
  }

  var lajk = [String];
  lajk[0] = "";

  var newPost={
    imeJela:ime,
    vremeSpremanja:vreme,
    recept:opis,
    tezinaSpremanja:tezina,
    vidljivost:false,
    slika:link,

    potrebniSastojci:listaSastojaka,
    tagovi:tagovi,

    idKorisnika:id,
    brojLajkova: 0,
    lajkovi: [],
  };

  console.log(newPost);

  try{
    var x = await axios.post("http://localhost:3000/api/posts",newPost);
    console.log(x);
    window.location.href = "Recepti.html";
  }
  catch(err){
    console.log(err);
  }
}