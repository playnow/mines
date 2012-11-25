// Extract Query string to find number of cells per row

var query = window.location.search;
if( query.substring(0, 1) == '?' ){
    query = query.substring(1);
}
if( ! query.length ){
    query = 8;
}
// query now contains number of cells....



function createNewGame(query){
    // Config
    this.HOLD_TIMEOUT_MS = 500; // 1000 MiliSecond for hold timeout
    // Create Game Object
    var gameOb = new Minesweeper( parseInt(query, 10) );
    gameOb.start();

    
    // BIND EVENTS /////////////////////////////////

    var downTimer;
    var holdEventOccured =false;

    // Bind single & Right clicks event on a cell
    $('.cell').mousedown(function(event){
        // EVENT: MOUSE DOWN
        holdEventOccured = false;
        clearTimeout(downTimer);
        downTimer = setTimeout( function(){
            gameOb.updateStatus("HOLD Recognized");
            holdEventOccured = true;
        }, HOLD_TIMEOUT_MS);
    }).mouseup(function (event){
        // EVENT: MOUSE UP   
        clearTimeout(downTimer);
        
        // Return if game over
        if( !gameOb.isGameValid ){
            return;
        }

        var cellID = $(this).attr('id');
        cellID = cellID.split( gameOb.rcJoiner );
        var row = parseInt( cellID[0] );
        var col = parseInt( cellID[1] );
        
        // detect which click/hold event?
        
        // detect hold event for mobile devices
        if(holdEventOccured){
            // Treat hold event as right-click
            gameOb.handleSpecialClick(row, col);
            return;
        }
        
        switch( event.which ){
            case 1:
                // Normal-click
                gameOb.handleNormalClick(row, col);
                break;
            case 3:
                // Double-click
                gameOb.handleSpecialClick(row, col);
                break;
            default:
                gameOb.updateStatus("Nothing to do " + event.which);
                break;
        }
    });
    
    // Tap events for smartphone
    
    //    $('.cell').hammer({
    //        // options...
    //        }).bind('hold', function(){
    //        var cellID = $(this).attr('id');
    //        cellID = cellID.split( gameOb.rcJoiner );
    //        var row = parseInt( cellID[0] );
    //        var col = parseInt( cellID[1] );
    //        gameOb.handleSpecialClick(row, col);
    //        alert('Double...');
    //    });
    


    // Disable right click
    $('.cell').bind("contextmenu", function(e) {
        return false;
    });
    
    // do with the stopwatch
    $('#clock').stopwatch();
    
    gameOb.updateStatus("Hold your click for flag!")
}




// Bind new Game

$('#newGameBtn').click(function(){
    createNewGame(query);
});


// Auto-start a new game
createNewGame(query);
