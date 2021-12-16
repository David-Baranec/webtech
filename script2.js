
//$(document).ready(function () {
    if(localStorage.getItem('level')==undefined){
        var round=0;
        localStorage.setItem('level', round);
   }
   else{
       var round=parseInt(localStorage.getItem('level'));
   }
   
   pieces = createPieces(true);
   
   $("#puzzleContainer").html(pieces);
   $("#btnStart").click(function () {
       round=(round%5);
       var pieces = $("#puzzleContainer div");
       pieces.each(function () {
           var leftPosition =
               Math.floor(Math.random() * 290) + "px";
           var topPosition =
               Math.floor(Math.random() * 290) + "px";

           $(this).addClass("draggablePiece")
               .css({
                   position: "absolute",
                   left: leftPosition,
                   top: topPosition
               }) //end $(this).addClass
           $("#piecesContainer").append($(this));

       }); //end fo pieces.each(function())
       var pieces = createPieces(false);

       $("#puzzleContainer").html(pieces);
       $(this).hide();
       
       $("#btnReset").show()
       implementLogic()
   }); // end  $("btnStart").click(function()
   $("#skip").click(function () {
       round+=1;
       localStorage.setItem('level', round);
       console.log(round)
       round=(round%5);
       var newPieces = createPieces(true);
       $("#puzzleContainer").html(newPieces);
       $("#piecesContainer").html("");
       //$(this).hide();
       //$("#btnStart").show();
   }); // end $("#btnReset").click(function()
   $("#btnReset").click(function () {
       if(round>0)
           round-=1;
       localStorage.setItem('level', round);
       var newPieces = createPieces(true);
       $("#puzzleContainer").html(newPieces);
       $("#piecesContainer").html("");
       $(this).hide();
       $("#btnStart").show();
   }); // end $("#btnReset").click(function()
   function createPieces(withImage) {
       //var image=createElement("img");
       
       //image.src='./images/'
      // var rows = arrItems[order].size, columns =arrItems[order].size;

       var rows=4, columns=4, size=100;
       var pieces = "";
       
           for (var i = 0, top = 0, order = 0; i < rows; i++, top -= size) {
               for (var j = 0, left = 0; j < columns; j++, left -= size, order++) {
                   if (withImage) {
                       switch(round){
                           case(1):
                           pieces += "<div style='background-position:"
                           + left + "px " + top + "px;' class='piece' id='first' data-order=" + order + "></div>";
                           break;
                           case(2):
                           pieces += "<div style='background-position:"
                           + left + "px " + top + "px;' class='piece'  id='third' data-order=" + order + "></div>";
                           break;
                           case(3):
                           pieces += "<div style='background-position:"
                           + left + "px " + top + "px;' class='piece'  id='second' data-order=" + order + "></div>";
                           break
                           case(4):
                           pieces += "<div style='background-position:"
                           + left + "px " + top + "px;' class='piece'  id='fifth' data-order=" + order + "></div>";
                           break
                           default:
                               pieces += "<div style='background-position:"
                               + left + "px " + top + "px;' class='piece' id='four' data-order=" + order + "></div>";
                       }
                   } // end if(withImage)
                   else
                       pieces +=
                           "<div style='background-image:none;' class='pieceHolder droppableSpace'></div>";
               } // end j loop
           } // end walk grid (i,j) for image pieces
               
       console.log(round)
       return pieces;
   } // end createPieces(withImage)



   function checkIfPuzzleSolved() {
       if ($("#puzzleContainer .droppedPiece").length != 16) {
           console.log("not full: " + $("#puzzleContainer .droppedPiece").length);
           return false;
       }
       for (var k = 0; k < 16; k++) {

           var item = $("#puzzleContainer .droppedPiece:eq(" + k + ")");
           var order = item.data("order");
           console.log("order: " + order);
           console.log("K: " + k);

           if (k != order) {
               $("#piecesContainer").text('No no! Try Again');
               return false;
           }
       }
       $("#piecesContainer").text(" Well done!");
       round+=3;
       localStorage.setItem('level', round);
       

   } // end checkIfPuzzleSolved()


   function implementLogic() {

       $(".draggablePiece").draggable({
           revert: "invalid",
           start: function () {
               if ($(this).hasClass("droppedPiece")) {
                   $(this).removeClass("droppedPiece");
                   $(this).parent().removeClass("piecePresent");
               }
           }
       });
       $(".droppableSpace").droppable({
           hoverClass: "ui-state-highlight",
           accept: function () {
               return !$(this).hasClass("piecePresent")
           },
           drop: function (event, ui) {

               var draggableElement = ui.draggable;
               var droppedOn = $(this);

               droppedOn.addClass("piecePresent");
               $(draggableElement)
                   .addClass("droppedPiece")
                   .css({
                       top: 0,
                       left: 0,
                       position: "relative"
                   }).appendTo(droppedOn);
               checkIfPuzzleSolved();
           } // end of drop:function
       }); // end $(".droppableSpace").droppable
   }  // end implementLogic()
//}); // end  $(document).ready(function()
