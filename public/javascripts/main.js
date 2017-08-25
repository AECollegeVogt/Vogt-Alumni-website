
$(document).ready(function() {
  $("#year").html( (new Date).getFullYear() );

  $("#activities").click(function(){
    if($("#social").is(":visible") == true) {
      $("#social").hide();
    } else {
      $("#main").hide();
    }   
    $("#action").show();
    return false;
  }); 

  $("#life").click(function(){
    if($("#action").is(":visible") == true) {
      $("#action").hide();
    } else {
      $("#main").hide();
    }   
    $("#social").show();
    return false;
  });

  //close menu if click on menu link --small devices only
  $('.nav a').click(function(){
    $('.navbar-collapse').collapse('hide');
  });

  // get the country data from the plugin
  var countryData = $.fn.intlTelInput.getCountryData(),
    telInput = $("#contact"),
    addressDropdown = $("#current-country");

  // init plugin
  telInput.intlTelInput({
    utilsScript: "/javascripts/utils.js", // just for formatting/placeholders etc
    preferredCountries: ['cm', 'fr']
  });

  // populate the country dropdown
  $.each(countryData, function(i, country) {
    addressDropdown.append($("<option></option>").attr("value", country.iso2).text(country.name));
  });
  // set it's initial value
  var initialCountry = telInput.intlTelInput("getSelectedCountryData").iso2;
  addressDropdown.val(initialCountry);

  // listen to the telephone input for changes
  telInput.on("countrychange", function(e, countryData) {
    addressDropdown.val(countryData.iso2);
  });

  // listen to the address dropdown for changes
  addressDropdown.change(function() {
    telInput.intlTelInput("setCountry", $(this).val());
  });

});



//datepicker for date of birth
$(function(){
	$( "#datepicker" ).datepicker({
		dateFormat : 'mm/dd/yy',
		changeMonth : true,
		changeYear: true,
		yearRange: '-100y:c+nn',
		maxDate: '-1d'
	});
});

//datepicker from-to
$( function() {
  var dateFormat = "mm/dd/yy",
    from = $( "#from" )
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true
      })
      .on( "change", function() {
        to.datepicker( "option", "minDate", getDate( this ) );
      }),
    to = $( "#to" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      changeYear: true
    })
    .on( "change", function() {
      from.datepicker( "option", "maxDate", getDate( this ) );
    });

  function getDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( dateFormat, element.value );
    } catch( error ) {
      date = null;
    }

    return date;
  }
} );

/* globals $ */
function scrollToElement (element) {
  $('html, body').animate({
    scrollTop: element.offset().top
  }, 1000);
};

function renderError (el, message) {
  el.text(message);
  el.css({
    color: '#d35400',
    display: 'inline'
  });
};

//event on submit button
$(function () {
  window.addEventListener('submit', function (e) {
    e.preventDefault();
    var requiredMatched = true;
    var form = $('form');
    var inputs = $('input[data-required]');

    inputs.each(function (i, el) {
      if (!el.checkValidity() || el.value === '') {
        el.setAttribute('required', true);
        requiredMatched = false;
        scrollToElement(form);
      }
    });

    if (requiredMatched) {

      $.ajax({
        url: form.attr('action'),
        type: form.attr('method'),
        data: form.serialize()
      }).then(function (data) {
        console.log('things are happening');
        $('.overlay-container').show();
        $('#join-button').hide();
        // To clear fields, so no annoying closing messages displayed by browser
        form.get(0).reset();
      }, function (res) {
        var data = JSON.parse(JSON.stringify(res.responseText));
        
        var errorElement;
        if (!data.emailValid) {
          errorElement = $('label[for=email] .error');
          scrollToElement(errorElement);
          renderError(errorElement, ' - ' + data.errorMessage);
          console.log(email);
        } 
        else {
          errorElement = $('#other-error');
          scrollToElement(form);
          renderError(errorElement, data.errorMessage);
        }
      });
    }
  });
});