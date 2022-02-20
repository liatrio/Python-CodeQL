document.addEventListener('DOMContentLoaded', function() {
    var myModal = new bootstrap.Modal(document.getElementById("myModal"), {});
    var myModalEl = document.getElementById('myModal');
    var anEvent = null;

    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }

    function clearWeekdays(){
      document.getElementById("sunday").checked = false;
      document.getElementById("monday").checked = false;
      document.getElementById("tuesday").checked = false;
      document.getElementById("wednesday").checked = false;
      document.getElementById("thursday").checked = false;
      document.getElementById("friday").checked = false;
      document.getElementById("saturday").checked = false;
    }

    function setWeekdays(){
      var dayOfWeek = new Date(document.getElementById("startTime").value).getDay();
      if(dayOfWeek == 0)
        document.getElementById("sunday").checked = true;
      else if(dayOfWeek == 1)
        document.getElementById("monday").checked = true;
      else if(dayOfWeek == 2)
        document.getElementById("tuesday").checked = true;
      else if(dayOfWeek == 3)
        document.getElementById("wednesday").checked = true;
      else if(dayOfWeek == 4)
        document.getElementById("thursday").checked = true;
      else if(dayOfWeek == 5)
        document.getElementById("friday").checked = true;
      else if(dayOfWeek == 6)
        document.getElementById("saturday").checked = true;
    }

    myModalEl.addEventListener('hidden.bs.modal', function (event) {
      document.getElementById("eventTitle").value = "";
      document.getElementById("startTime").value = "";
      document.getElementById("endTime").value = "";
      document.getElementById("allDay").checked = false;
      document.getElementById("makeRecurring").checked = false;
      document.getElementById("daysOfWeek").style.display = "none";
      document.getElementById("allDayDiv").style.display = "block";
      document.getElementById("endTimeDiv").style.display = "block";
      clearWeekdays();
      anEvent = null;
    })

    var eventStart = document.getElementById("startTime");
    eventStart.addEventListener('change', () => {clearWeekdays(); setWeekdays();}, false);

    var makeRecur = document.getElementById("makeRecurring");
    makeRecur.addEventListener('change', () => {
      var style = document.getElementById("daysOfWeek").style.display
      if(style == "none"){
        setWeekdays();
        document.getElementById("daysOfWeek").style.display = "block";
      }
      else{
        clearWeekdays();
        document.getElementById("daysOfWeek").style.display = "none";
      }
    }, false);

    var submitButton = document.getElementById("submitButton");
    submitButton.addEventListener('click', function() {
      if(anEvent){
        anEvent.remove();
        anEvent = null;
      }

      var utitle = document.getElementById("eventTitle").value;
      var ustart = document.getElementById("startTime").value;
      var uend = document.getElementById("endTime").value;
      var uallDay = document.getElementById("allDay").checked;

      var isRecurring = document.getElementById("makeRecurring").checked;
      if(isRecurring){
        var endDate = new Date(uend);
        var startDate = new Date(ustart);
        var ustartTime = new String(Math.abs(startDate.getHours())).padStart(2, '0') + `:` + new String(Math.abs(startDate.getMinutes())).padStart(2, '0');
        var uendTime = new String(Math.abs(endDate.getHours())).padStart(2, '0') + `:` + new String(Math.abs(endDate.getMinutes())).padStart(2, '0');

        var eventDays = new Array();
        if(document.getElementById("sunday").checked)
          eventDays.push(0);
        if(document.getElementById("monday").checked)
          eventDays.push(1);
        if(document.getElementById("tuesday").checked)
          eventDays.push(2);
        if(document.getElementById("wednesday").checked)
          eventDays.push(3);
        if(document.getElementById("thursday").checked)
          eventDays.push(4);
        if(document.getElementById("friday").checked)
          eventDays.push(5);
        if(document.getElementById("saturday").checked)
          eventDays.push(6);

        if(uallDay)
          ustartTime = null;

        calendar.addEvent({
          title: utitle,
          start: ustart,
          startTime: ustartTime,
          end: uend,
          endTime: uendTime,
          allDay: uallDay,
          daysOfWeek: eventDays,
          editable: false
        }, true);
        myModal.hide();
      }
      else{
        calendar.addEvent({
          title: utitle,
          start: ustart,
          end: uend,
          allDay: uallDay,
          editable: true
        }, true);
        myModal.hide();
      }
    }, false);

    var deleteBtn = document.getElementById("deleteButton");
    deleteBtn.addEventListener('click', function() {
      anEvent.remove();
      myModal.hide();
      anEvent = null;
    }, false);

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      themeSystem: 'bootstrap5',
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'addEventButton dayGridMonth,timeGridWeek logOut'
      },
      customButtons: {
        addEventButton: {
          text: 'add event',
          click: function() {
            document.getElementById("exampleModalLabel").innerHTML = "Add Event";
            document.getElementById("makeRecurringDiv").style.display = "block";
            document.getElementById("deleteButton").style.display = "none";
            myModal.show();
          }
        },
        logOut: {
          text: 'log out',
          click: function() {
            window.location.assign("/logout");
          }
        }
      },
      aspectRatio: 2.11,
      dayMaxEvents: true,
      events: {
        url: '/api/events/',
        failure: function() {
          alert("Failure fetching events");
        }
      },
      editable: true,
      eventClick: function(info) {
        var eventObj = info.event;
        var offSet = new Date().getTimezoneOffset();
        var strt = ""
        if(eventObj.start)
          strt = new Date(Date.parse(eventObj.start) + offSet * -60 * 1000).toISOString().slice(0,16)
        var end = ""
        if(eventObj.end)
          end = new Date(Date.parse(eventObj.end) + offSet * -60 * 1000).toISOString().slice(0,16)
        document.getElementById("exampleModalLabel").innerHTML = "Edit Event";
        document.getElementById("deleteButton").style.display = "block";

        document.getElementById("eventTitle").value = eventObj.title;
        document.getElementById("startTime").value = strt;
        document.getElementById("endTime").value = end;
        document.getElementById("allDay").checked = eventObj.allDay;

        if(eventObj._def.recurringDef){
          document.getElementById("daysOfWeek").style.display = "block";
          document.getElementById("makeRecurring").checked = true;
          var daysOfWeekInt = eventObj._def.recurringDef.typeData.daysOfWeek.map(Number);
          for (var i = 0; i < daysOfWeekInt.length; i++) {
            if(daysOfWeekInt[i] == 0)
              document.getElementById("sunday").checked = true;
            else if(daysOfWeekInt[i] == 1)
              document.getElementById("monday").checked = true;
            else if(daysOfWeekInt[i] == 2)
              document.getElementById("tuesday").checked = true;
            else if(daysOfWeekInt[i] == 3)
              document.getElementById("wednesday").checked = true;
            else if(daysOfWeekInt[i] == 4)
              document.getElementById("thursday").checked = true;
            else if(daysOfWeekInt[i] == 5)
              document.getElementById("friday").checked = true;
            else if(daysOfWeekInt[i] == 6)
              document.getElementById("saturday").checked = true;
          }
        }

        anEvent = eventObj;

        myModal.show()
      },
      eventAdd: function(info) {
        var eventObj = info.event;
        var data = null;
        var ustart = document.getElementById("startTime").value;
        var uend = document.getElementById("endTime").value;
        var endDate = new Date(uend);
        var uallDay = document.getElementById("allDay").checked;
        var startDate = new Date(ustart);
        if(eventObj._instance){
          data = { title: eventObj.title, start: ustart, end: uend, allDay: eventObj.allDay, editable: true };
        }
        else{
          var ustartTime = null;
          if(!uallDay)
            ustartTime = new String(Math.abs(startDate.getHours())).padStart(2, '0') + `:` + new String(Math.abs(startDate.getMinutes())).padStart(2, '0');
          var uendTime = new String(Math.abs(endDate.getHours())).padStart(2, '0') + `:` + new String(Math.abs(endDate.getMinutes())).padStart(2, '0');
          data = { title: eventObj.title,
                          start: ustart,
                          startTime: ustartTime,
                          end: uend,
                          endTime: uendTime,
                          allDay: uallDay,
                          daysOfWeek: eventObj._def.recurringDef.typeData.daysOfWeek,
                          editable: false
          };
        }

        const csrftoken = getCookie('csrftoken');
        fetch('api/events/', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
          },
          body: JSON.stringify(data),
        })
        calendar.refetchEvents();
      },
      eventChange: function(info) {
        var eventObj = info.event;
        var offSet = new Date().getTimezoneOffset();
        var ustart = new Date(Date.parse(eventObj.start) + offSet * -60 * 1000).toISOString().slice(0,16)
        var uend = ustart;
        if(eventObj.end)
          uend = new Date(Date.parse(eventObj.end) + offSet * -60 * 1000).toISOString().slice(0,16)
        var data = { title: eventObj.title, start: ustart, end: uend, allDay: eventObj.allDay, editable: true };

        const csrftoken = getCookie('csrftoken');
        fetch(`api/events/${eventObj.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
          },
          body: JSON.stringify(data),
        })
      },
      eventRemove: function(info) {
        var eventObj = info.event;
        const csrftoken = getCookie('csrftoken');
        fetch(`api/events/${eventObj.id}/`, {method: 'DELETE', headers: {'X-CSRFToken': csrftoken}})
      }
    });
    calendar.render();
  });
