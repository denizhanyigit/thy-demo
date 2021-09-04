import data from '../data/flights.js';

export default function step2(){ 
  getFlights();
  $('.js-flight-info').html(
    localStorage.getItem('originAirport')+' - '+localStorage.getItem('destinationAirport')+', '+localStorage.getItem('personCount')+' Yolcu'
  );

  $('#js-promotion').change(function(){
    promotionChange();
  });

  function promotionChange(){
    if($('#js-promotion').prop('checked')){
      $('.js-promotion-info').removeClass('d-none');
      $('.category-element').each(function(){
        if($(this).attr('data-category-type')=="ecoFly"){
          var priceSpan = $(this).find('.price');
          priceSpan.html(priceSpan.attr('data-normal-price'));
          var newPrice = parseFloat(priceSpan.html()/2);
          priceSpan.html(newPrice);
        } else {
          $(this).find('button').attr('disabled',true);
        }
      });
    } else {
      $('.js-promotion-info').addClass('d-none');
      $('.category-element').each(function(){
        if($(this).attr('data-category-type')=="ecoFly"){
          var priceSpan = $(this).find('.price');
          priceSpan.html(priceSpan.attr('data-normal-price'));
        } else {
          $(this).find('button').attr('disabled',false);
        }
      });
    }
  }

  $('.js-sort-fly').click(function(){
    const sortType = $(this).attr('data-sort-type');
    $('.js-promotion-div').addClass('off');   
    getFlights(sortType);    
  });

  $('.js-back-to-top').click(function(){
    $('.js-error').addClass('d-none');
    $('body').css('background-color', '#063048');
    $('.navbar-first').removeClass('d-none');
    $('.navbar-second').addClass('d-none');
    $('.step-1').removeClass('d-none');
    $('input[name="origin-airport"]').val("");
    $('input[name="destination-airport"]').val("");
    $('.js-person-icon').html('<i class="fa fa-male people-icon-1"></i>');
    $('.js-person-count-small').html('1');
    $('.js-person-count').html('1');
    $('#economy-class').prop('checked',true);
    $('.js-person-choose-modal').addClass('d-none');
  });

  function flySelect(element){
    var status = element.attr('data-status');
    if(status=="AVAILABLE"){
      var personCount = localStorage.getItem('personCount');
      var price = parseFloat($('#'+element.attr('data-id')).html()*personCount);
      $('.step-2').addClass('d-none');
      $('.js-total-price').html('TRY '+price);
      $('.js-traveller-count').html(personCount);
      $('.js-ticket-price').html('TRY '+$('#'+element.attr('data-id')).html());
      $('.js-success').removeClass('d-none');
    } else if(status=="ERROR"){
      $('.step-2').addClass('d-none');
      $('.js-error').removeClass('d-none');
    }
  }


  function getFlights(sort="eco-fly"){
    const flights = data["flights"];
    const originAirport = localStorage.getItem('originAirport');
    const destinationAirport = localStorage.getItem('destinationAirport');

    if(sort=="eco-fly"){
      
      // Eco Fly'a Göre Default Sıralama

      flights.sort(function(a,b){
        return a["fareCategories"]["ECONOMY"]["subcategories"][0]["price"]["amount"]-b["fareCategories"]["ECONOMY"]["subcategories"][0]["price"]["amount"]
      });

    } else if(sort=="date") {

      // Kalkış Saatine Göre Sıralama

      flights.sort(function(a,b){
        return new Date("Fri Sep 03 2021 "+a["arrivalDateTimeDisplay"]+" GMT+0300 (GMT+03:00)") - new Date("Fri Sep 03 2021 "+b["arrivalDateTimeDisplay"]+" GMT+0300 (GMT+03:00)")
      });
    }
    
    $('.js-flights-content').html('');
    flights.forEach((element,index) => {
      if(element.originAirport.name==originAirport && element.destinationAirport.name==destinationAirport){
        var economyCategory = element["fareCategories"]["ECONOMY"]["subcategories"];
        var businessCategory = element["fareCategories"]["BUSINESS"]["subcategories"];
        var flightsDiv,economyDiv,businessDiv,ecoCategoryElement="",businessCategoryElement="";

        flightsDiv = '<div class="row mt-3"><div class="col-6"><div class="card" style="min-height: 120px; border:none; border-radius: 5px; box-shadow: 0 4px 8px 0 rgba(0,0,0,.05);"><div class="card-body d-flex align-items-center">'+
        '<div class="col-2 text-left"><span class="d-block font-weight-bold">'+element.arrivalDateTimeDisplay+'</span><span class="d-block" style="color: grey;">'+element.originAirport.code+'</span>'+
        '<span class="d-block" style="font-size: 14px; color: grey;">'+element.originAirport.city.name+'</span></div><div class="col-5" style="border-bottom: 2px solid #9E9E9E; width: 100%; height: 10px;">'+
        '</div><div class="col-2 text-right"><span class="d-block font-weight-bold">'+element.departureDateTimeDisplay+'</span><span class="d-block" style="color: grey;">'+element.destinationAirport.code+'</span>'+
        '<span class="d-block" style="font-size: 14px; color: grey;">'+element.destinationAirport.city.name+'</span></div><div class="col-3 p-3"><span class="small d-block" style="color: grey;">Uçuş Süresi</span>'+
        '<span class="small d-block font-weight-bold">'+element.flightDuration+'</span></div></div></div></div>';

        economyDiv = '<div class="col-3"><div id="class-type-economy-'+index+'" class="card js-economy-or-business" style="min-height: 120px; border:none; border-radius: 5px; box-shadow: 0 4px 8px 0 rgba(0,0,0,.05);"><div class="card-body d-flex align-items-center">'+
        '<div class="col-5"><div class="form-check form-check-inline"><input class="form-check-input" type="radio" data-target="economy-'+index+'" name="class-type" id="economy-class-'+index+'">'+
        '<label class="form-check-label small" style="font-size: 14px; color: grey;" for="economy-class-'+index+'">ECONOMY</label></div></div><div class="col-6">'+
        '<span class="d-block small" style="color: grey;">Yolcu Başına</span><span class="d-block font-weight-bold">'+element.fareCategories.ECONOMY.subcategories[0].price.currency+' '+element.fareCategories.ECONOMY.subcategories[0].price.amount+'</span></div><div class="col-1 text-right"><i class="fa fa-angle-down"></i></div></div></div></div>';

        businessDiv = '<div class="col-3"><div id="class-type-business-'+index+'" class="card js-economy-or-business" style="min-height: 120px; border:none; border-radius: 5px; box-shadow: 0 4px 8px 0 rgba(0,0,0,.05);"><div class="card-body d-flex align-items-center">'+
        '<div class="col-5"><div class="form-check form-check-inline"><input class="form-check-input" type="radio" data-target="business-'+index+'" name="class-type" id="business-class-'+index+'">'+
        '<label class="form-check-label small" style="font-size: 14px; color: grey;" for="business-class-'+index+'">BUSINESS</label></div></div><div class="col-6">'+
        '<span class="d-block small" style="color: grey;">Yolcu Başına</span><span class="d-block font-weight-bold">'+element.fareCategories.BUSINESS.subcategories[0].price.currency+' '+element.fareCategories.BUSINESS.subcategories[0].price.amount+'</span></div><div class="col-1 text-right"><i class="fa fa-angle-down"></i></div></div></div></div></div>';        
        
        $('.js-flights-content').append(flightsDiv+economyDiv+businessDiv);

        economyCategory.forEach((category) => {
          var rights = "";
          category["rights"].forEach((right) => {
            rights = rights + '<li style="list-style: none; border: 1px solid rgba(0,0,0,.125); padding: 18px; text-align: left;">'+right+'</li>';
          });
          ecoCategoryElement = ecoCategoryElement+'<div data-category-type="'+category.brandCode+'" class="col-4 category-element d-none economy-'+index+'"><div class="card" style="min-height: 400px;"><div class="row card-header" style="margin-left: 0px !important; margin-right: 0px !important; background-color: #f9f9f9;">'+
          '<h5 class="text-left">'+category.brandCode+'</h5><span class="font-weight-normal small mr-1" style="margin-left:auto">'+category.price.currency+'</span><span id="economy-'+category.brandCode+'-'+index+'" data-normal-price="'+category.price.amount+'" class="mr-2 font-weight-bold price">'+category.price.amount+'</span></div>'+
          '<div class="card-body" style="padding: 0px;"><ul class="list-group">'+rights+'</ul></div><button type="button" data-id="economy-'+category.brandCode+'-'+index+'" data-status="'+category.status+'" class="btn p-3 text-white js-fly-select" style="background-color: #E81932; border:none">Uçuşu Seç</button> </div></div>';               
        });
        businessCategory.forEach((category) => {
          var rights = "";
          category["rights"].forEach((right) => {
            rights = rights + '<li style="list-style: none; border: 1px solid rgba(0,0,0,.125); padding: 18px; text-align: left;">'+right+'</li>';
          });
          businessCategoryElement = businessCategoryElement+'<div data-category-type="'+category.brandCode+'"  class="col-4 category-element d-none business-'+index+'"><div class="card" style="min-height: 400px;"><div class="row card-header" style="margin-left: 0px !important; margin-right: 0px !important; background-color: #f9f9f9;">'+
          '<h5 class="text-left">'+category.brandCode+'</h5><span class="font-weight-normal small mr-1" style="margin-left:auto">'+category.price.currency+'</span><span id="business-'+category.brandCode+'-'+index+'" data-normal-price="'+category.price.amount+'" class="mr-2 font-weight-bold price">'+category.price.amount+'</span></div>'+
          '<div class="card-body" style="padding: 0px;"><ul class="list-group">'+rights+'</ul> </div><button data-status="'+category.status+'" type="button" data-id="business-'+category.brandCode+'-'+index+'" class="btn p-3 text-white js-fly-select" style="background-color: #E81932; border:none">Uçuşu Seç</button> </div></div>';                        
        });
        $('.js-flights-content').append('<div class="row mt-4">'+ecoCategoryElement+'</div>'+'<div class="row mt-4">'+businessCategoryElement+'</div>');      
      }
    });
    promotionChange();
    $('input[name="class-type"]').change(function(){
      if($(this).prop('checked')){
        $('.category-element').addClass('d-none');
        $('.js-economy-or-business').removeClass('active-select');
        const target = $(this).attr('data-target');
        $('.'+target).removeClass('d-none');
        $('#class-type-'+target).addClass('active-select');
      }    
    });
    $('.js-fly-select').click(function(){
      flySelect($(this));
    });
  }
}
