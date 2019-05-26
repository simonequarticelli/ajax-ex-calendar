// Creare un calendario dinamico con le festività.
// Partiamo dal gennaio 2018 dando la possibilità di cambiare mese,
// gestendo il caso in cui l’API non possa ritornare festività.
// Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018 (unici dati disponibili sull’API).
// Ogni volta che cambio mese dovrò:
// 1. Controllare se il mese è valido (per ovviare al problema che l’API non carichi holiday non del 2018)
// 2. Controllare quanti giorni ha il mese scelto formando così una lista
// 3. Chiedere all’api quali sono le festività per il mese scelto
// 4. Evidenziare le festività nella lista

//API
//https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0.

$(document).ready(function(){

  //data gennaio 2018
  var data_iniziale  = moment('2018-01-01', 'YYYY-MM-DD');
  //console.log(data_iniziale.format('YYYY-MM-DD'));

  /////////////////////////////////////////////////////////////////////////////
  //salvo il template-1 dentro a una variabile
  var template__calendar = $('.template__calendar').html();
  //richiamo il compile
  var template_1 = Handlebars.compile(template__calendar);
  //creo oggetto template-1
  var context_1 = {
    date: data_iniziale.format('MMMM YYYY'),
  }
  //appendo il template-1 con le sue variabili
  var html = template_1(context_1);
  $('.container__handlebars').append(html);
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  //salvo il template-2 dentro a una variabile
  var template__days = $('.template__days').html();
  //richiamo il compile
  var template_2 = Handlebars.compile(template__days);
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  //date min e max
  var data_inizio = '2018-01-01';
  var data_fine = '2018-12-01';
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  //creo funzione per generare il mese e chiamare API
  function gen_days_in_month_check_holidays(data_iniziale){

    //assegno variabile come chiamata (im modo da ricevere le festivita del mese corrente)
    var mese = data_iniziale.month();
    //console.log(mese);

    $.ajax ({
      url: "https://flynn.boolean.careers/exercises/api/holidays?year=2018",
      method: "get",
      data: {
        'month': mese,
      },
      success: function(risposta){
        //console.log(risposta.response);

        //inserisco la risposta in una variabile che mi restituira un oggetto
        var lista_festivita = risposta.response;
        console.log(lista_festivita);

        //array con festivita e date (create per confronto)
        var array_date_festivita_mese_corrente = [];

        //eseguo il ciclo for-in per leggere i dati dall'oggetto
        for (var field in lista_festivita) {
          array_date_festivita_mese_corrente.push(lista_festivita[field].date);
        }

        console.log(array_date_festivita_mese_corrente);

        //giorni che ci sono nel mese
        var giorni_nel_mese = moment(data_iniziale).daysInMonth();
        //console.log(giorni_nel_mese);

        var nome_giorno = data_iniziale.format('ddd');
        //console.log(nome_giorno);

        //creo funzione per assegnare lo 0 per confronto con API
        function zero(dato){
          if (dato < 10) {
            dato = '0' + dato;
          }
          return dato;
        }

        //creo array id giorni mese
        var array_data_giorni_mesi = [];

        //calcolo i giorni in base al mese
        for (var i = 1; i <= giorni_nel_mese; i++) {

          //creo i giorni
          var num_giorno = i + ' ' + data_iniziale.format('MMM');

          //popolo l'attributo data per confrontarlo con API
          var id = data_iniziale.format('YYYY-MM-') + zero(i);
          //console.log(id);

          array_data_giorni_mesi.push(id);

          //creo oggetto template-2
          var context_2 = {
            days: num_giorno,
            num_day: id,

          }

          var html = template_2(context_2);
          $('.template__days__container').append(html);

        }
        console.log(array_data_giorni_mesi);

        //ciclo i contenitori dei giorni per per trovare le corrispondenze
        $('.days').each(function(){
          for (var i = 0; i < array_date_festivita_mese_corrente.length; i++) {
            if (lista_festivita[i].date == $(this).attr('data-numero')) {
              console.log($(this).attr('data-numero'));
              $(this).addClass('lightPink');
              $(this).children('.nome_festivita').append(lista_festivita[i].name);
            }
          }
        });

      },
      error: function(richiesta, stato, errori){
        console.log(errori);
      }
    });

  }
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  gen_days_in_month_check_holidays(data_iniziale);
  /////////////////////////////////////////////////////////////////////////////

  $('#prev').fadeOut(200);
  
  /////////////////////////////////////////////////////////////////////////////
  $(document).on('click', '#next', function(){ //<--doc .on necessario per elemento dinamico

    //svuoto il contenitore
    $('.container__handlebars').empty();

    //controllo in console il funzionamento
    // data_iniziale.format('M');
    // console.log(data_iniziale.format('M'));

    if (data_iniziale.isSameOrAfter(data_fine)){

      //aggiorno le variabili del template-1
      var context_1 = {
        date: data_iniziale.format('MMMM YYYY'),
      }

      //appendo template-1 con la variabile aggiornata
      var html = template_1(context_1);
      $('.container__handlebars').append(html);

      //richiamo funzione per generare mese
      gen_days_in_month_check_holidays(data_iniziale);

      $('#next').fadeOut(200);

    }else{

      //al click vado avanti di un mese
      data_iniziale.add(1, 'months');

      //aggiorno le variabili del template-1
      var context_1 = {
        date: data_iniziale.format('MMMM YYYY'),
      }

      //appendo template-1 con la variabile aggiornata
      var html = template_1(context_1);
      $('.container__handlebars').append(html);

      //richiamo funzione per generare mese
      gen_days_in_month_check_holidays(data_iniziale);

    }

  });
  /////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////
  $(document).on('click', '#prev', function(){

    //svuoto il contenitore
    $('.container__handlebars').empty();

    //controllo in console il funzionamento
    // data_iniziale.format('M');
    // console.log(data_iniziale.format('M'));

    if (data_iniziale.isSameOrBefore(data_inizio)) {

      //aggiorno le variabili del template-1
      var context_1 = {
        date: data_iniziale.format('MMMM YYYY'),
      }

      //appendo template-1 con la variabile aggiornata
      var html = template_1(context_1);
      $('.container__handlebars').append(html);

      //richiamo funzione per generare mese
      gen_days_in_month_check_holidays(data_iniziale);

      $('#prev').fadeOut(200);

    }else{

      //al click vado indietro di un mese
      data_iniziale.subtract(1, 'months');

      //aggiorno le variabili del template-1
      var context_1 = {
        date: data_iniziale.format('MMMM YYYY'),
      }

      //appendo template-1 con la variabile aggiornata
      var html = template_1(context_1);
      $('.container__handlebars').append(html);

      //richiamo funzione per generare mese
      gen_days_in_month_check_holidays(data_iniziale);

    }

  });
  /////////////////////////////////////////////////////////////////////////////

  //CHIEDERE SE QUESTO METODO POTEVA ANDARE BENE
  // var data = moment().month(0).format('MMMM');
  // moment(data).add(1, 'months');

});
