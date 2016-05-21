
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
        document.getElementById('list').onclick=app.list_device
		document.getElementById('connect').onclick=app.connect
		document.getElementById('send').onclick=app.send
		$('#send').hide()
    },
    // Update DOM on a Received Event
	list_device:function(){
		app.status('listing......')
		$('select').remove()
		$('#inform_show').after($('<select></select>').attr('id','select_device'))
		$('#select_device').empty()
		bluetoothSerial.list(function(devices) {
			devices.forEach(function(device) {
				
				if (device.hasOwnProperty("uuid")) { // TODO https://github.com/don/BluetoothSerial/issues/5
                app.deviceId = device.uuid;
				} else if (device.hasOwnProperty("address")) {
                app.deviceId = device.address;
				} else {
                app.deviceId = "ERROR " + JSON.stringify(device);
				}

				$('#select_device').append($('<option></option>').val(app.deviceId).text(app.deviceId))
			})
		app.status('list completed')
		}, function(){app.status('list failed')});
	},
	connect:function(){
		
		var deviceID=$("#select_device").val()
		alert (deviceID)
		app.status('connecting to '+deviceID)
		bluetoothSerial.connect(deviceID, app.onConnect, app.ondisConnect)
	},
	status:function(k){
		$('#inform_show').text(k)
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
};

app.initialize();