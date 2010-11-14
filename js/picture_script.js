google.load('search', '1');

var searchControl;
var YMAX = 40;

// scales an image to have a
// fixed height YMAX preserving the ratio
function ScaleImage(x, y){
  return(Math.round(YMAX*x/y));
}


// this function retuns a closure
// which is meant to be a callback
// target is expected to be a span.
function MakeAddImageCallback(target) {
  return(
    function(result, may){
      leImage = may.results[0]; // take only the top result
      imgTag = $("<img />", {
	"src":leImage.unescapedUrl, // leImage.url escapes important characters
	"title":target.html(),
	"height":YMAX,
	"width":ScaleImage(Number(leImage.width), Number(leImage.height)),
	"click":function(){ // when img is clicked, replace with text
	  $(this).html(this.title);
	}
      });

      target.html(imgTag);}
    );
}

// this is the callback initally assigned to each word span
// if the contents is an image, then replace with title
// otherwise set a new callback on searchControl, and execute a search.
function picture(x){
  if($(x).children().length > 0 && $(x).children()[0].nodeName === "IMG"){
    $(x).html($(x).children()[0].title);
  } else {
    searchControl.setSearchCompleteCallback(this, MakeAddImageCallback($(x)));
    searchControl.execute($(x).html());
  }
}


$(document).ready(function() {
  // Create a search control
  searchControl = new google.search.SearchControl();
  searchControl.addSearcher(new google.search.ImageSearch());

  // tell the searcher to draw itself and tell it where to attach
  searchControl.draw(document.getElementById("searchcontrol"));

  searchControl.setResultSetSize(1);

  // wrap in spans
  $('#picturethis').html(function(i, html) {
    var temp = [],
    n = 0,
    inTag = false;

    $.each(html.split(' '), function(index, text) {
      if(inTag) {
	temp[n++] = text;
	if(/>[^<]*$/.test(text)) {
	  inTag = false;
	}
      } else {
	if(/^[^>]*</.test(text)) {
	  inTag = true;
	  temp[n++] = text;
	} else {
	  temp[n++] = '<span onClick="picture(this)">'+text+'</span>';
	}
      }
    });

    temp = temp.join(' ');

    $('pre').text(function(i, text) {
      return text + "\n\n" + temp;
    });

    return temp;
    });
});

