//var base_url = "http://localhost/pgexample/teacherapp/www/";
var base_url = "http://greyboxerp.com/xavier/";

function getSID(){
	var sid = localStorage.getItem("sid");
	if(sid != null)
		return sid;
	else
		return 0;
}

function getMessageID(){
	var sid = localStorage.getItem("mid");
	if(sid != null)
		return sid;
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

function getNewMsg(sid,mid){
	
	var sql = "sid=" + sid + "&mid=" + mid + "&key=" + localStorage["db"];
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				//alert(req.responseText);
				var dataArray=JSON.parse(req.responseText);
				populateMsg(dataArray);
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("GET", base_url + "getMsg.php?" + sql, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
}
function populateMsg(data){
		var chat = document.getElementById("chat");
		var msgstr = "";
		var tmp = "";
		var name = getParameterByName("name");
		
		for (var i = 0; i < data.length; i++) {
			var icon = "R"; var color ="55C1E7";
			
			if(data[i]['scope']!="cid" && data[i]['scope']!="sid"){
				// Individual msg from Student
				msgstr += getLeftMsg(data[i]['msg'],name,data[i]['scopeid'],data[i]['mid'],  data[i]['ts']);
			}
			else if(data[i]['scope']=="sid"){
				// Individual repl to student
				msgstr += getRightMsg(data[i]['msg'],"",data[i]['scopeid'],data[i]['mid'], data[i]['ts']);				
			}	
			else if(data[i]['cid']==localStorage.getItem("cid") ){
				// Announcements for a given class
				msgstr += getRightMsg(data[i]['msg'],"<i class='fa fa-rotate-180 fa-volume-up'></i>",data[i]['scopeid'],data[i]['mid'],  data[i]['ts']);
			}
			
			tmp = data[i]['mid'];           
		}
		
		localStorage.setItem(mid, tmp);
		chat.innerHTML = msgstr;
		setTimeout(function(){window.scrollTo(0,document.body.scrollHeight+350);}, 250);
		
}

function getLeftMsg(m,id,sid,mid, ts){
	var icon = id.substr(0,2).toUpperCase();
	
	msg = "<li id='m_"+mid+"' class='left clearfix'><span class='chat-img pull-left'>";
	//msg += "<img src='http://placehold.it/45/"+getRandomColor(sid)+"/fff&text="+icon+"' alt='User Avatar' class='img-circle' /></span>";
	  msg += "<div class='circleBase type1' style='background:#"+getRandomColor(sid)+"'>"+icon+"</div>";
    msg += "</span><div class='chat-body clearfix'><div class='header'>";
	msg += "<strong class='primary-font' style='font-size:12px;'>"+ id +"</strong> <small style='font-size:8px;' class='pull-right text-muted'>";
	msg += "<i class='fa fa-clock-o'></i></span> "+formatDateY(ts)+"</small></div>";
	msg += "<p><small>" + m ;
	msg += "  </small></p></div> </li>";
    
	return msg;	
}

function getRightMsg(m,id,sid,mid, ts){
	var icon = "R";
	
	msg = "<li id='m_"+mid+"' class='right clearfix' style='background-color:#e6fff9;'><span class='chat-img pull-right'>";
	//msg += "<img src='http://placehold.it/45/ff9933/fff&text="+icon+"' alt='User Avatar' class='img-circle' /></span>";
	msg += "<div class='circleBase type1' style='background:#ff9933'>"+icon+"</div>";
    msg += "</span><div class='chat-body clearfix' ><div class=' header'>";
	msg += "<strong class='pull-right primary-font' style='font-size:12px;'>"+ id +"</strong> </div>";
	msg += "<p style='text-align:right;padding-top:5px;'><small>" + m ;
	
	msg += "</small></p><small style='font-size:8px;' class='pull-right text-muted'>";
	msg += "<i class='fa fa-clock-o'></i></span> "+formatDateY(ts)+"</small></div> </li>";
    
	return msg;	
}




function sendmsg(sid){
	var msg = document.getElementById("btn-input").value;
	var sql = "scope=sid&sid=" + sid + "&cid=" + localStorage.getItem("cid") + "&msg=" + msg + "&key=" + localStorage["db"];
	sendmessage(sql,msg);
}

function broadcastmsg(){
	var msg = document.getElementById("btn-input").value;
	var sql = "scope=cid&sid=" + localStorage.getItem("cid") + "&cid=" + localStorage.getItem("cid") + "&msg=" + msg + "&key=" + localStorage["db"];
	sendmessage(sql,msg);
}

function sendmessage(sql,msg){
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				//alert(req.responseText);
				
				var chat = document.getElementById("chat");
				chat.innerHTML += getRightMsg(msg,"","","");
				document.getElementById("btn-input").value="";
				window.scrollTo(0,document.body.scrollHeight+300);
				
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("GET", base_url + "/_setMsg.php?" + sql, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
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

function getNewBroadCastMsg(cid,mid){
	
	var sql = "cid=" + cid + "&mid=" + mid + "&key=" + localStorage["db"];
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4 && req.status == 200) {
			try {
				//alert(req.responseText);
				var dataArray=JSON.parse(req.responseText);
				populateMsg(dataArray);
								
			} catch (e) {
				console.log("Exception::-"+e.toString());
			}
		}
	};
	
	req.open("GET", base_url + "/_getBroadcast.php?" + sql, true);
	req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	req.send();
}