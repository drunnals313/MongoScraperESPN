
$.getJSON("/articles", function (data) {
  
  for (var i = 0; i < data.length; i++) {

      if (data[i].saved) {
        
          $(".articlesSaved").append(
        
              "<div data-id='" + data[i]._id + "' class='card'>" +
              "<img id= 'imageSize' class='card-img-top' src='" + data[i].img + "' alt='Card image cap'>" +
              "<div class='card-body'>" +
              "<h4 id='articleTitle' class='card-title' href='" + data[i].link + "'><b>" + data[i].title + "</b></h4>" +
              "<p id='articleDesc' class='card-text'>" + data[i].description + "</p>" +
              "<a href=\"http://www.espn.com/" + data[i].link + "\">Full Article Link></a>" + "<br>" + "<br>" +
              "<button data-id='" + data[i]._id + "' id='deleteBtn' class='btn btn-outline-primary my-2 my-sm-0' type='submit'>Delete From Saved Articles" + "</button>" +
                "<input type='text' placeholder='Name' name='name' class='validate active'>" + 
                "<input type='text' placeholder='Comment' name='comment' class='validate active'>" + "<br>" +
              "</div>" +
              "</div>" + "<br>"
              
          );
      /*     console.log("\"http://www.espn.com/" + data[i].link + "\""); */
      } else {
        /* $(".articles").clear(); */
          $(".articles").append(
            
              "<div data-id='" + data[i]._id + "' class='card'>" +
              "<img id= 'imageSize' class='card-img-top' src='" + data[i].img + "' alt='Card image cap'>" +
              "<div class='card-body'>" +
              "<h4 id='articleTitle' class='card-title' href='" + data[i].link + "'><b>" + data[i].title + "</b></h4>" +
              "<p id='articleDesc' class='card-text'>" + data[i].description + "</p>" +
              "<a href=\"http://www.espn.com/" + data[i].link + "\">Full Article Link></a>" + "<br>" + "<br>" +
              "<button data-id='" + data[i]._id + "' id='saveBtn' class='btn btn-outline-primary my-2 my-sm-0' type='submit'>Save This Article" + "</button>" +
              "</div>" +
              "</div>" + "<br>"
          );
         /*  console.log("\"http://www.espn.com/" + data[i].link + "\""); */
      }
  }
});

$(document).on("click", "#scrapeBtn", function () {
  $.ajax({
      method: "GET",
      url: "/scrape"
  }).done(function () {
      location.reload();
  })
});

$(document).on("click", "#saveBtn", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
          "saved": true
      }
  }).done(function (data) {
      location.reload();
  })
});

$(document).on("click", "#deleteBtn", function () {

  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
          "saved": false
      }
  }).done(function (data) {
      location.reload();
  })
});

