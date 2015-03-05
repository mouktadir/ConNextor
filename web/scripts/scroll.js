var lightBulbVisible = false,
	currentSection,
	currentDisplayingPicture = 0,
	offset = 0.5,
	fadeTime = 300;

	
var canvas, context;
$(document).ready(function () {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    $('#stay-tuned').on('click', function () {
        var scrollPoint = $('#register').offset().top;
        $('body,html').animate({scrollTop: scrollPoint}, 400);
        return false;
    });

    document.forms['invitation'].onsubmit = function post() {
        var name = document.forms['invitation'].name.value,
            email = document.forms['invitation'].email.value,
            interest = document.forms['invitation'].interest.value,
            altinterest = document.forms['invitation'].altinterest.value;
        var title = document.getElementById('form-title');

        postEmailToServer(name, email, interest, altinterest);
        $('form[name="invitation"]').fadeOut();
        swapWithAltText(title);
        return false;
    };

    $('#altInterestInput').hide();

    $('#interestInput').change(function(){
        if($('#interestInput').val() == 'other'){
            $('#altInterestInput').show();
        } else {
            $('#altInterestInput').hide();
        }
    });

});

/**
 * With every scroll, checks the current position and the section updates.
 */
$(window).scroll(function () {
	var distanceFromTop = $(window).scrollTop(),
		windowHeight = $(window).height();
	currentSection = distanceFromTop / windowHeight;
	//console.log('Currently in: ' + currentSection + ' (int): ' + parseInt(currentSection));

	// prevent light bulb from loading first.
	if (!lightBulbVisible) {
		$(".light-bulb")[0].style.visibility = "visible";
		lightBulbVisible = true;
	}

	// note that we round the current section anyways
	// any offset < 0.5 would cause periods of inactivity
	// any offset > 0.5 would cause this function to be called too many times
	if (Math.abs(currentSection - currentDisplayingPicture) > offset) {
		changeSection(Math.round(currentSection));
		//drawLine($(window).width()/2.5,200, $(window).width()/2.5+160, 200);
		//$("#section1").css("position","fixed"); 
		//drawLine($(window).width()/2.5,500, $(window).width()/2.5+160, 500);
	}
});

function drawLine(startX,startY,endX,endY){
	var amount = 0;
	setInterval(function() {
		amount += 0.05; 
		if (amount > 1) amount = 1;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = "black";
		context.moveTo(startX, startY);
		context.lineTo(startX + (endX - startX) * amount, startY + (endY - startY) * amount);
		context.lineWidth=2;
		context.stroke();
	}, 30);
}

/**
 * Updates all visual elements associated with the given section.
 * This includes the time-line side pane, the picture in the bulb
 * as well as the background change and dotted line
 *
 * @param newSection
 */
function changeSection(newSection) {
	if (currentDisplayingPicture == newSection) return;
	//console.log('changed to ' + newPicture);

	document.getElementById("light_bulb_image").className = "light_bulb_image"+(newSection);
	$("#light_bulb_image_container").hide().fadeIn(fadeTime);
	$("#section"+newSection+"text").fadeIn(fadeTime);
	currentDisplayingPicture = newSection;
}

function highlightCurrentTimeLineElement(newSection) {

}

function swapWithAltText(element) {
    element.innerHTML = element.getAttribute('alt');
}