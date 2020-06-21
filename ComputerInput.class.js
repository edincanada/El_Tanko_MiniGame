

var ComputerInput = function ( pTargets )
{
  this._targets = pTargets ;
  this._currentTarget = this._targets[ 0 ] ;
  
  this._waitingTime = 0 ;
  this._burstLength = -1 ;
  this.shooting = true ;
  
  this._previousLocation = { } ;
  this.tank = null ;
  
  this.moveUp = false ;
  this.moveDown = false ;
  this.moveLeft = true ;
  this.moveRight = false ;
  
  this._currentDirection = ComputerInput.East ;
} ;


ComputerInput.MIN_TIME_BETWEEN_SHOTS = 100 * 40 ;
ComputerInput.MAX_TIME_BETWEEN_SHOTS = 300 * 40 ;

ComputerInput.MIN_TIME_BETWEEN_BURSTS = 2000 * 40 ;
ComputerInput.MAX_TIME_BETWEEN_BURSTS = 5000 * 40 ;

ComputerInput.MIN_BURST_LENGTH = 2000 * 40 ;
ComputerInput.MAX_BURST_LENGTH = 4000 * 40 ;

ComputerInput.East = 0 ,
ComputerInput.North = 1 ,
ComputerInput.West = 2 ,
ComputerInput.South = 3 ;


ComputerInput.prototype.setTank = function ( pTank )
{
  this.tank = pTank ;
  
  var bounds = this.tank.getBounds() ;
  
  this._previousLocation.top = bounds.top ;
  this._previousLocation.left = bounds.left ;
  this._previousLocation.bottom = bounds.bottom ;
  this._previousLocation.right = bounds.right ;
  
  
  
} ;


ComputerInput.prototype.chooseNewRandomDirection = function ( )
{
  var options =
    [ ComputerInput.East , ComputerInput.North , ComputerInput.West , ComputerInput.South ] ;
    
  options.splice( options.indexOf( this._currentDirection ) , 1 ) ;
  
  return options[ this.randomIntInRange( 0 , options.length -1 )] ;
} ;

ComputerInput.prototype.setDirection = function ( pDirection )
{
  this._currentDirection = pDirection ;
  
  this.moveUp = ( this._currentDirection == ComputerInput.North ) ;
  this.moveDown = ( this._currentDirection == ComputerInput.South ) ;
  this.moveLeft = ( this._currentDirection == ComputerInput.East ) ;
  this.moveRight = ( this._currentDirection == ComputerInput.West ) ;
} ;

ComputerInput.prototype.sameBounds = function ( )
{
  var bounds = this.tank.getBounds() ;
  
  return (
  this._previousLocation.top == bounds.top &&
  this._previousLocation.left == bounds.left &&
  this._previousLocation.bottom == bounds.bottom &&
  this._previousLocation.right == bounds.right
  ) ;
} ;

ComputerInput.prototype.move = function ( )
{
  if ( this.sameBounds()) //previous location is same as current
  {
    this.setDirection( this.chooseNewRandomDirection()) ;
  }
  else
  {
    if ( this.randomIntInRange( 1 , 150 ) > 149 )
    {
      this.setDirection( this.chooseNewRandomDirection()) ;
    }
  }
} ;

ComputerInput.prototype.update = function ( )
{
  this.move() ;
  
  if ( this._burstLength < 1 )
  {
    this._burstLength = this.randomIntInRange(
      ComputerInput.MIN_BURST_LENGTH ,
      ComputerInput.MAX_BURST_LENGTH
    ) ;
    
    this._waitingTime = this.randomIntInRange(
      ComputerInput.MIN_TIME_BETWEEN_BURSTS ,
      ComputerInput.MIN_TIME_BETWEEN_BURSTS
    ) ;
  }
  this.straightShooting() ;
  
  var bounds = this.tank.getBounds() ;
  
  this._previousLocation.top = bounds.top ;
  this._previousLocation.left = bounds.left ;
  this._previousLocation.bottom = bounds.bottom ;
  this._previousLocation.right = bounds.right ;
} ;

ComputerInput.prototype.randomIntInRange = function ( pMin , pMax )
{
  return Math.floor( Math.random() * ( pMax - pMin + 1 )) + pMin ;
} ;

ComputerInput.prototype.straightShooting = function ( )
{
  this.shooting = false ;
  
  if ( this._burstLength > 0 )
  {
    var waitedTime = 1000 ;

    this._waitingTime -= waitedTime ;
    this._burstLength -= waitedTime ;

    if ( this._waitingTime < 1 )
    {
      this.shooting = true ;
      this._waitingTime = this.randomIntInRange(
        ComputerInput.MIN_TIME_BETWEEN_SHOTS ,
        ComputerInput.MAX_TIME_BETWEEN_SHOTS
      ) ;
    }
  }
} ;

ComputerInput.prototype.getAim = function  ( )
{
  var bounds = this._currentTarget.getBounds() ;
  
  return {
    x : bounds.left + (( bounds.right - bounds.left ) / 2.0 ) ,
    y : bounds.top + (( bounds.bottom - bounds.top ) / 22.0 )
  } ;
} ;

ComputerInput.prototype.shoot = function ( )
{
  this.shooting = true ;
} ;
