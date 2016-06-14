
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        document.getElementById('list').onclick=blueTooth.list_device
		document.getElementById('connect').onclick=blueTooth.connect
		document.getElementById('send').onclick=blueTooth.send
		$('#send').hide()
    },
    // Update DOM on a Received Event
	
	status:function(k){
		$('#inform_show').text(k)
	},
	area:function(){
		app.height= $(window).height();
		app.width=$(window).width();
	}
};
var blueTooth={
	list_device:function(){
		app.status('listing......')
		$('select').remove()
		$('#inform_show').after($('<select></select>').attr('id','select_device'))
		$('#select_device').empty()
		bluetoothSerial.list(function(devices) {
			devices.forEach(function(device) {
				
				if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
                blueTooth.deviceId = device.uuid;
				} else if (device.hasOwnProperty("address")) {
                blueTooth.deviceId = device.address;
				} else {
                blueTooth.deviceId = "ERROR " + JSON.stringify(device);
				}

				$('#select_device').append($('<option></option>').val(blueTooth.deviceId).text(blueTooth.deviceId))
			})
		app.status('list completed')
		}, function(){app.status('list failed')});
	},
	connect:function(){
		
		var deviceID=$("#select_device").val()
		alert (deviceID)
		app.status('connecting to '+deviceID)
		bluetoothSerial.connect(deviceID, blueTooth.onConnect, blueTooth.ondisConnect)
	},
	onConnect:function(){
		$('#send').show()
		app.status('connect')
	},
	ondisConnect:function(){
		app.status('disconnect')
	},
	send:function(){
		bluetoothSerial.write("a")
	}
}
var director={

	init:function(w,h){
		$('body').width(w).height(h)
		var area=w/5;
		var pos=[w/4,h/3]
		$('.directioner').width(area).height(area).css('left',pos[0]).css('top',pos[1]);
		this.get_moving(pos,area)

	},
	get_moving: function(pos,area){
		var centerPos=[pos[0]+area/2,pos[1]+area/2]
		$('body').mousedown(function(e){

			var positionX=e.pageX-$(this).offset().left;
			var positionY=e.pageY-$(this).offset().top;
			director.move_condirectioner(positionX-area/2,positionY-area/2)
			

			$('body').mousemove(function(e){

				positionX=e.pageX-$(this).offset().left;
				positionY=e.pageY-$(this).offset().top;

				if((positionX-centerPos[0])*(positionX-centerPos[0])+(positionY-centerPos[1])*(positionY-centerPos[1])>(area*1)*(area*1))
				{
					var prop = Math.sqrt(((area*1)*(area*1))/((positionX-centerPos[0])*(positionX-centerPos[0])+(positionY-centerPos[1])*(positionY-centerPos[1])))
					director.move_condirectioner((positionX-centerPos[0])*prop+centerPos[0]-area/2,(positionY-centerPos[1])*prop+centerPos[1]-area/2)
				}
				else{
					director.move_condirectioner(positionX-area/2,positionY-area/2)
				}
			})
			$('body').mouseup(function(e){
				$('body').unbind();
				director.move_condirectioner(pos[0],pos[1])
				director.get_moving(pos,area)
			})
		})

	},
	move_condirectioner:function(x,y){
		$('.directioner').css('left',x).css('top',y);
	}


}
app.initialize();
//app.area()
//director.init(app.width,app.height)