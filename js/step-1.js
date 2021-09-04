import data from '../data/flights.js';
import step2 from '../js/step-2.js';

export default function step1() {
  $('.js-where-from').click(function () {
    $('#js-where-from-modal').modal('show');
  });

  $('.js-to-where').click(function () {
    $('#js-to-where-modal').modal('show');
  });

  $('.js-person-choose').click(function () {
    const modal = $('.js-person-choose-modal');
    if (modal.hasClass('d-none')) {
      modal.removeClass('d-none');
    } else {
      modal.addClass('d-none');
    }
  });

  $('.js-person-minus').click(function () {
    const person_count = parseInt($('.js-person-count').html());
    var new_count = person_count - 1
    $('.js-person-count').html(new_count);
    $('.js-person-count-small').html(new_count);    
    $('.people-icon-' + person_count).remove();
    if (new_count == 1) {
      $('.js-person-minus').prop("disabled", true);
    } else if (new_count == 3) {
      $('.js-person-count-plus').remove();
    }
  });

  $('.js-person-plus').click(function () {
    const person_count = parseInt($('.js-person-count').html());
    var new_count = person_count + 1
    $('.js-person-count').html(new_count);
    $('.js-person-count-small').html(new_count);    
    $('.js-person-minus').prop("disabled", false);
    if (new_count == 4) {
      $('.js-person-icon').append('<i class="fa fa-plus js-person-count-plus ml-1"></i>');
    } else if (new_count < 4) {
      $('.js-person-icon').append('<i class="fa fa-male ml-1 people-icon-' + new_count + '"></i>');
    }
  });

  $('.list-group-item').hover(function () {
    $('.list-group-item').removeClass('active');
    $(this).addClass('active');
  });

  $('.list-group-item').click(function () {
    var airport = $(this).html();
    $('.' + $(this).attr('data-input-class')).val(airport);
  });  

  $('.js-airport-form').submit(function (e) {
    airportChooseForm(e);
  });

  function swal(title,message,type){
    Swal.fire(
      title,
      message,
      type
    )
  }

  function airportChooseForm(e) {
    e.preventDefault();
    const originAirport = $('input[name="origin-airport"]').val();
    const destinationAirport = $('input[name="destination-airport"]').val();
    if (originAirport && destinationAirport) {
      const classType = $("input[name='class-type']:checked").val();
      const personCount = parseInt($('.js-person-count').html());

      // Origin and Destination Control

      var status = false;
      const flights = data["flights"];
      flights.forEach((element) => {
        if (element.originAirport.name == originAirport && element.destinationAirport.name == destinationAirport) {
          status = true;
        }
      });

      if (status) {
        localStorage.setItem('originAirport', originAirport);
        localStorage.setItem('destinationAirport', destinationAirport);
        localStorage.setItem('classType', classType);
        localStorage.setItem('personCount', personCount);
        step2();
        setTimeout(function(){
          $('body').css('background-color', 'white');
          $('.navbar-first').addClass('d-none');
          $('.navbar-second').removeClass('d-none');
          $('.step-1').addClass('d-none');
          $('.step-2').removeClass('d-none');
        },100);        
      } else {
        swal('Başarısız!','Belirlediğiniz kalkış ve varış noktalarına ait uçuş bulunamadı.','error');
      }

    } else {
      swal('Uyarı!','Kalkış ve varış noktası seçmelisiniz.','warning');
    }
  }
}