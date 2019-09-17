//var base_url = "http://localhost/pgexample/teacherapp/www/";
var base_url = "http://greyboxerp.com/xavier/";
var att = [];

function getCID(){
	var cid = localStorage.getItem("cid");
	if(cid != null)
		return cid;
	else
		return 0;
}

function getMessageID(){
	var mid = localStorage.getItem("mid");
	if(mid != null)
		return mid;
	else
		return 0;
}

function getLocalMsg(mid){
	var msgs = "{}";
	if(mid > 0){
		if(localStorage.getItem("msgs") != null)
			msgs = JSON.parse(localStorage.getItem("msgs"));
	}
	return msgs;	
}

function populateLocalMsg(mid){
	var msgs = getLocalMsg(mid);
	populateMsg(msgs);
}

function getNewMsg(cid,mid){
	
	var sql = "cid=" + cid + "&mid=" + mid + "&markread=" + localStorage.getItem('markread') + "&key=" + localStorage["db"];;
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				localStorage.removeItem('markread');
				//alert(req.responseText);
				var dataArray=JSON.parse(req.responseText);
				populateMsg(dataArray);
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("GET", base_url + "/_getMsg.php?" + sql, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
}

function populateMsg(data){
		var chat = document.getElementById("chat");
		var msgstr = "";
		var tmp = "";
		
		
		for (var i = 0; i < data.length; i++) {
			var icon = "R"; var color ="55C1E7";
			
			if(data[i]['scope']!="cid" && data[i]['scope']!="sid"){
				// Individual msg from Student
				msgstr += getLeftMsg(data[i]['msg'],data[i]['fname'],data[i]['scopeid'],data[i]['mid'], data[i]['ts']);
			}
			else if(data[i]['scope']=="sid"){
				// Individual repl to student
				msgstr += getRightMsg(data[i]['msg'],data[i]['scopeid'], data[i]['ts']);				
			}	
			
			tmp = data[i]['mid'];           
		}
		
		localStorage.setItem(mid, tmp);
		chat.innerHTML = msgstr;
}

function getLeftMsg(m,id,sid,mid,ts){
	var icon = id.substr(0,2).toUpperCase();
	
	msg = "<li id='m_"+mid+"' class='left clearfix'><span class='chat-img pull-left'>";
	//msg += "<img src='http://placehold.it/50/"+getRandomColor(sid)+"/fff&text="+icon+"' alt='User Avatar' class='img-circle' />";
    msg += "<div class='circleBase type1' style='background:#"+getRandomColor(sid)+"'>"+icon+"</div>";
	msg += "</span><div class='chat-body clearfix'><div class='header'>";
	msg += "<strong class='primary-font'>"+ id +"</strong> <small class='pull-right text-muted'>";
	msg += "<i class='fa fa-clock-o'></i></span> "+formatDateY(ts)+"</small></div>";
	msg += "<p>" + m ;
	msg += "<span style='float:right;'><i class='fa fa-reply' onclick=\'gotochat("+sid+",&apos;"+id+"&apos;)\'> </i>&nbsp;&nbsp;<span onclick='markread("+mid+")' class='markread'> Mark as read  </span></span>";
	msg += "  </p></div> </li>";
    
	return msg;	
}

function getRightMsg(m,id,ts){
	msg = "<li class='right clearfix'><span class='chat-img pull-right'>";
	msg += "<img src='http://placehold.it/50/FA6F57/fff&text=R' alt='User Avatar' class='img-circle' /></span>";
    msg += "<div class='chat-body clearfix'><div class='header'>";
	msg += "<small class='pull-left text-muted'>";
	msg += "<i class='fa fa-clock-o'></i></span> "+formatDateY(ts)+"</small></div><br>";
	msg += "<p>" + m ;
	msg += "  </p></div> </li>";
    
	return msg;	
}

function sendmsg(sid){
	var msg = document.getElementById("btn-input").value;
	var sql = "sid=" + sid + "&msg=" + msg;
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				//alert(req.responseText);
				//location.reload();
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("POST", base_url + "/setMsg.php", true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(sql);
}

function getRandomColor(sid) {
  var colors = ["ff6347","ff00ff","ff0080","00cc00","ff6347","55C1E7","003399","990033","ff6347","55C1E7"];
  var toText = sid.toString(); //convert to string
  var lastChar = toText.slice(-1); //gets last character
  var lastDigit = +(lastChar); 
  
  return colors[lastDigit];
}

function gotochat(sid,id){
	window.location.href="oneoone.html?sid="+sid+ "&name=" + id;
}

function markread(mid){
	document.getElementById("m_"+mid).style.display = "none";
	if (localStorage.getItem("markread") === null) {
			localStorage.setItem('markread', mid);
	}else{
		var new_mid = localStorage.getItem('markread') + "," + mid;
		localStorage.setItem('markread', new_mid);
	}
		
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function populateSt(data){
		var chat = document.getElementById("chat");
		var msg = "";var id="";var icon="";
		var tmp = "";
		chat.innerHTML = "";
		
		
		for (var i = 0; i < data.length; i++) {
			id = data[i]['fname'];
			icon = id.substr(0,2).toUpperCase();
			
			msg += "<li id='m_"+data[i]['admn']+"' class='left clearfix'><span class='chat-img pull-left'>";
			//msg += "<img src='http://placehold.it/45/"+getRandomColor(data[i]['admn'])+"/fff&text="+icon+"' alt='User Avatar' class='img-circle' /></span>";
			msg += "<div class='circleBase type1' style='background:#"+getRandomColor(data[i]['admn'])+"'>"+icon+"</div>";
			msg += "</span><div class='chat-body clearfix'><div class='header'>";
			msg += "<strong class='primary-font' style='font-size:12px;'>"+ id +"</strong><span class='pull-right markread' onclick=\'gotochat("+data[i]['admn']+",&apos;"+id+"&apos;)\'> Start Chat </span> </div>";
			
			msg += "<p style='font-size:10px;'><small>s/o " + data[i]['fathername'] + "</small></p>" ;
			msg += "<p align='right'>"+data[i]['admn']+"</p></div> </li>";           
		}
		
		
		chat.innerHTML = msg;
		document.getElementById('msg').style.display = "inline";
		document.getElementById('users').style.display = "none";
}

function showStList(flg){
var sql = "cid=" + localStorage.getItem("cid") + "&key=" + localStorage["db"];
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				var dataArray=JSON.parse(req.responseText);
				populateSt(dataArray);
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	//var base_url = document.URL.substr(0,document.URL.lastIndexOf('/'));
	
	req.open("GET", base_url + "/_getStudents.php?" +  sql, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
	
}
function showAttList(){
var sql = "cid=" + localStorage.getItem("cid") + "&key=" + localStorage["db"];
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {				
				var dataArray=JSON.parse(req.responseText);
				populateAtt(dataArray['students']);
				processAttend(dataArray['attend']);
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	//var base_url = document.URL.substr(0,document.URL.lastIndexOf('/'));
	
	req.open("GET", base_url + "/_getStudentsAtt.php?" +  sql, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
	
}
function processAttend(data){
	
	for (var i = 0; i < data.length; i++) {
		
		try{
			document.getElementById("m_" + data[i]['sid']).style.background = "#F1A9A0";
			att.push(parseInt(data[i]['sid']));
		} catch (e) {}
	}
	
}

function populateAtt(data){
		var chat = document.getElementById("chat");
		var msg = "";var id="";var icon="";
		var tmp = "";
		chat.innerHTML = "";
		
		
		for (var i = 0; i < data.length; i++) {
			id = data[i]['fname'];
			icon = id.substr(0,2).toUpperCase();
			msg += "<span class='chat-img pull-right'>";
			//msg += "<button type='button' class='btn btn-success'>Present</button>";
			msg += "<button style='height:50px;' type='button' class='btn btn-warning' name='markabs' onclick='markAbs("+data[i]['admn']+");'>Absent</button></span>";
			
			msg += "<li id='m_"+data[i]['admn']+"' class='left clearfix'><span class='chat-img pull-left'>";
			msg += "<div class='circleBase type1' style='background:#"+getRandomColor(data[i]['admn'])+"'>"+icon+"</div>";
			msg += "</span><div class='chat-body clearfix'><div class='header'>";
			msg += "<strong class='primary-font' style='font-size:12px;'>"+ id +"</strong> </div>";
			msg += "<p style='font-size:12px;'><small>s/o " + data[i]['fathername'] + "</small></p>" ;
			msg += "<p style='font-size:12px;' align='left'><small>"+data[i]['admn']+"</small></p></div></li>";    				
		}
		
		chat.innerHTML = msg;
}

function markAbs(sid){
	var ele = document.getElementById("m_" + sid);
	if(ele.style.background == "rgb(241, 169, 160)"){
		ele.style.background = "white";
		var i = att.indexOf(sid);
		if(i!= -1)
			att[i] = "";
	}	
	else{	
		ele.style.background = "#F1A9A0";
		att.push(sid);
	}
}

function updateAttendance(){
	
	var chat = document.getElementById("chat").innerHTML;
	// save this innetHTML locally so that it can be accessed by Go Back button
	localStorage.setItem("stattend",chat);
	
	var html = document.createElement('html');
	html.innerHTML = chat;
	var li = html.getElementsByTagName('li');
	var bt = html.getElementsByTagName('button');
	
	// Hide all <li>s
	for (var i=0;i<li.length;i++){
		li[i].classList.add("gbhide");
		bt[i].classList.add("gbhide");
	}
	
	document.getElementById("chat").innerHTML = html.innerHTML;
	
	// Now display <li>s that are absent
	
	for (var i=0; i < att.length; i++){
		 try{
			 document.getElementById("m_" + att[i]).classList.remove("gbhide");
		 }catch (e) {
				console.log("Exception::-"+e.toString());
			}
	}
	//Enable confirm/goback buttons
	document.getElementById("btn-confirm").classList.remove("gbhide");
	document.getElementById("btn-back").classList.remove("gbhide");
	document.getElementById("btn-chat").classList.add("gbhide");
	
}

function attBack(){
	document.getElementById("chat").innerHTML = localStorage.getItem("stattend");
	document.getElementById("btn-confirm").classList.add("gbhide");
	document.getElementById("btn-back").classList.add("gbhide");
	document.getElementById("btn-chat").classList.remove("gbhide");
}

function sendAtt(){
	var sql = "secret=" + JSON.stringify(att) + "&key=" + localStorage["db"];
	document.getElementById("smsstat").style.display = "block";
	$("#smsstat").html("Updating Attendance...");
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {				
				//alert(req.responseText)
				$("#smsstat").html("Updated...Sending Messages on Student APP.");
				localStorage.setItem("stattend","");
				//window.location.href = "dashboard.html";
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
//	var base_url = document.URL.substr(0,document.URL.lastIndexOf('/'));
	
	req.open("POST", base_url + "/_saveattendence.php", true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send(sql);
	
}
function sendSMSBySID(){
	//alert(JSON.stringify(result));
	var sql = JSON.stringify(att);
	document.getElementById("smsstat").style.display = "block";
	$("#smsstat").html("Sending SMS...");
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				$("#smsstat").html("Sent SMS to students...Done!");
				window.location.href = "dashboard.html";
			} catch (e) {	}
		}
	};
	
	//var base_url = document.URL.substr(0,document.URL.lastIndexOf('/'));
	
	req.open("GET", base_url + "/smsAtt.php?q="+sql, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
	
	}	  

function showHW(){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				var hw = document.getElementById("notice");
				localStorage.setItem("hwlist",hw.innerHTML);  
				//hw.innerHTML = "<div id='back'><i class='fa fa-2x fa-arrow-circle-left' onclick='backHW();'></i> &nbsp; Back</div><br>";
				hw.classList.add('notesArea');
				var data=JSON.parse(req.responseText);
	
				for (var i = 0; i < data.length; i++) {		
					hw.innerHTML += "<div  style='height: 60px;font-family:Comic Sans MS;text-transform:capitalize;'><p style='margin-left:10px'><small style='color:orange;white-space: pre-wrap;'>" + data[i]['hwdate'] + "</small><br>" + "<b> "+data[i]['subject']+" </b> : "  + data[i]['descr'] ;
		
					if(data[i]['imgs'].length>0){
						var imgs = data[i]['imgs'].split(',');
						var im = "";
						for (var x=0; x< imgs.length; x++){
							im +="<br><img src='"+imgs[x]+"' class='img-thumbnail'  alt='HW Image'  />";
						}
						hw.innerHTML += im;
					}
				}	
					
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("GET", base_url + "/_getHW.php?cid=" + localStorage.getItem("cid") + "&key=" + localStorage["db"], true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
}

function addHW(){
	document.getElementById("panel-footer").classList.remove("gbhide");
	window.scrollTo(0,document.body.scrollHeight+ 50);
}

function formatDateY(dt){
	if(dt == null) return "Sending..";
	try{
		var dateObj = new Date(dt);
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var m = dateObj.getMinutes();
		if(m < 10)
			newdate =  getM(month) + " " + day + " " + dateObj.getHours() + ":0" +dateObj.getMinutes() + " " ;
		else
			newdate =  getM(month) + " " + day + " " + dateObj.getHours() + ":" +dateObj.getMinutes() + " " ;
				
		return newdate;
	} catch(e){return dt;}
}

function getM(m){
 if(m==1)
 	return "Jan";
 else if(m==2)
    return "Feb";
 else if(m==3)
    return "Mar"; 
 else if(m==4)
    return "Apr";  
 else if(m==5)
    return "May"; 
 else if(m==6)
    return "Jun";   
 else if(m==7)
    return "Jul"; 
 else if(m==8)
    return "Aug";  
 else if(m==9)
    return "Sep";  
 else if(m==10)
    return "Oct"; 
 else if(m==11)
    return "Nov";
 else if(m==12)
    return "Dec";     

}

function sendHW(sub,hwdesc,imguri){
	
	var imageURI = localStorage.getItem("imageURI");
	if(imageURI.length > 0){
		var dt = Date.now();
		uploadImageURI(imageURI,dt);
		var sql = "sub=" + sub + "&hwdesc=" + hwdesc + "&cid=" + localStorage.getItem("cid") + "&img=" + dt;
	 }
	 else	
		var sql = "sub=" + sub + "&hwdesc=" + hwdesc + "&cid=" + localStorage.getItem("cid") + "&img=";	
	
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				//alert(req.responseText);
				document.getElementById("btn-send").disabled = false;	
				location.reload();
				
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("GET", base_url + "/_setHW.php?" + sql + "&key=" + localStorage["db"], true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
}