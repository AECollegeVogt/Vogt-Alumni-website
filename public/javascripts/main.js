
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
    addressDropdown = $("#current-country"),
          errorMsg = $("#error-msg"),
          validMsg = $("#valid-msg");

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

  var reset = function() {
      telInput.removeClass("error");
      errorMsg.addClass("hide");
      validMsg.addClass("hide");
    };
    // on blur: validate
    telInput.blur(function() {
      reset();
      if ($.trim(telInput.val())) {
        if (telInput.intlTelInput("isValidNumber")) {
          validMsg.removeClass("hide");
        } else {
          telInput.addClass("error");
          errorMsg.removeClass("hide");
        }
      }
    });
    // on keyup / change flag: reset
    telInput.on("keyup change", reset);

});


//datepicker for date of birth
$(function(){
	$( "#dateOfBirth" ).datepicker({
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
    scrollTop: element.offset().top - $('.navbar').outerHeight() * 2
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
  $('label[for]').each(function(i, el){
    var $el = $(el);
    var input = $('#' + $el.attr('for'));

    if (input.data('required') == null) {
      return;
    }

    input.on('input change', function() {
      if (!this.checkValidity()) {
        $el.addClass('error');
      } else {
        $el.removeClass('error');
      }
    });
  });

  var passwordField = $('#password');
  var confirmField = $('#confirmPassword');

  passwordField.add(confirmField).on('input', function(e) {
    var confirmLabel = $('label[for="' + confirmField.attr('name') + '"]');

    if (confirmField.val() !== passwordField.val()) {
      confirmLabel.addClass('error');
    } else {
      confirmLabel.removeClass('error');
    }
  });

  window.addEventListener('submit', function (e) {
    e.preventDefault();
    var requiredMatched = true;
    var form = $('form');
    var inputs = $('input[data-required]');

    inputs.each(function (i, el) {
      if (!el.checkValidity() || el.value === '') {
        if (requiredMatched) {
          requiredMatched = false;
          scrollToElement($(el));
        }

        // el.setAttribute('required', true);

        $('label[for="' + el.name + '"]').addClass('error');
      }
    });

    if (!requiredMatched) {
      return;
    }

    if (passwordField.val() !== confirmField.val()) {
      requiredMatched = false;
      renderError($('#other-error'), 'Les mots de passe ne correspondent pas');
      scrollToElement(passwordField);
      return;
    }

    var formData = $('#form').serializeArray(); 
    for (var i = 0; i < formData.length; i++) {  
      if (formData[i].name === 'contact') {    
        formData[i].value = $("#contact").intlTelInput('getNumber');    
        break;  
      } 
    };

    $.ajax({
      url: form.attr('action'),
      type: form.attr('method'),
      data: $.param(formData)
    }).then(function (data) {
      console.log('things are happening', data);
      $('.overlay-container').show();
      $('#join-button').hide();
      // To clear fields, so no annoying closing messages displayed by browser
      form.get(0).reset();
    }, function (res) {
      var data = JSON.parse(res.responseText);

      var errorElement;
      if (!data.isNewUser) {
        // TODO: Show message indicating to use directory instead
        errorElement = $('#other-error');
        renderError(errorElement, data.errorMessage);
        scrollToElement(errorElement);
      }
      else if (!data.emailValid) {
        errorElement = $('label[for=email] .error');
        renderError(errorElement, ' - ' + data.errorMessage);
        scrollToElement(errorElement);
        console.log(email);
      }
      else {
        errorElement = $('#other-error');
        renderError(errorElement, data.errorMessage);
        scrollToElement(errorElement);
      }
    });
  });
});