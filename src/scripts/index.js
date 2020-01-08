import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import Pikaday from "Pikaday";

import "../styles/index.css";
import "../styles/index.scss";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
class TicketSoftCalendar {
  iCalendar;
  events = [];

  constructor() {
    this.render();
    this.renderDatePicker();
    this.appendFilterSelectButton();
  }
  updateEvents = events => {
    this.events = events;
    this.clearAllEvents();
    this.renderEvents(events);
  };

  filterEvents = filterValue => {
    const events =
      filterValue === "All"
        ? this.events
        : this.events.filter(event => event.type === filterValue);
    this.renderEvents(events);
  };

  renderEvents = events => {
    this.clearAllEvents();
    this.calendar.addEventSource({ events });
  };

  clearAllEvents = () => {
    if (!this.calendar) return;
    var eventSources = this.calendar.getEventSources();
    eventSources.every(eventSource => eventSource.remove());
  };

  renderDatePicker = () => {
    const picker = new Pikaday({
      field: document.querySelector(".fc-datepicker-button"),
      format: "yy-mm-dd",
      onSelect: dateString => {
        picker.gotoDate(new Date(dateString));
        this.calendar.gotoDate(new Date(dateString));
      }
    });
  };

  render = () => {
    const calendarEl = document.getElementById("calendar");
    this.calendar = new Calendar(calendarEl, {
      dir: "rtl",
      locale: "he",
      header: false,
      events: this.events,
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      timeZone: "local",
      defaultView: "dayGridMonth",
      businessHours: {
        startTime: "10:00",
        endTime: "18:00"
      },
      header: {
        left: "next,prev today datepicker",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      customButtons: {
        datepicker: {
          text: "Datepicker",
          click: function() {}
        }
      },
      eventClick: event => {
        console.log(event.event.extendedProps);
      },
      dateClick: info => {
        if ("dayGridMonth" === this.calendar.view.type) {
          this.calendar.changeView("timeGridWeek", info.dateStr);
          this.calendar.gotoDate(info.dateStr);
          return;
        }

        if ("timeGridWeek" === this.calendar.view.type) {
          this.calendar.changeView("timeGridDay", info.dateStr);
          this.calendar.gotoDate(info.dateStr);
          return;
        }
      }
    });

    this.calendar.render();
  };

  appendFilterSelectButton = () => {
    const select = document.createElement("select");
    select.addEventListener("change", event => {
      const filterValue = event.target.value;
      this.filterEvents(filterValue);
    });
    const options = [
      {
        value: "All",
        text: "All"
      },
      {
        text: "room1",
        text: "room 1"
      },
      {
        value: "room2",
        text: "room 2"
      },
      {
        value: "room3",
        text: "room 3"
      },
      {
        value: "room4",
        text: "room 4"
      },
      {
        value: "room5",
        text: "room 5"
      },
      {
        value: "room6",
        text: "room 6"
      }
    ];
    for (var i = 0; i < options.length; i++) {
      var opt = document.createElement("option");
      opt.value = options[i].value;
      opt.innerText = options[i].text;
      select.appendChild(opt);
    }

    document.querySelector(".fc-right").appendChild(select);
    // const filterEventsElm = document.getElementById("filterEvents");
    // const todayElm = document.getElementById("today");
    // const nextElm = document.getElementById("next");
    // const prevElm = document.getElementById("prev");
    // const dayGridMonthElm = document.getElementById("dayGridMonth");
    // const timeGridWeekElm = document.getElementById("timeGridWeek");
    // const timeGridDayElm = document.getElementById("timeGridDay");

    // todayElm.addEventListener("click", () => {
    //   this.calendar.today();
    // });

    // nextElm.addEventListener("click", () => {
    //   this.calendar.next();
    // });

    // prevElm.addEventListener("click", () => {
    //   this.calendar.prev();
    // });

    // dayGridMonthElm.addEventListener("click", () => {
    //   this.calendar.changeView("dayGridMonth");
    // });

    // timeGridWeekElm.addEventListener("click", () => {
    //   this.calendar.changeView("timeGridWeek");
    // });

    // timeGridDayElm.addEventListener("click", () => {
    //   this.calendar.changeView("timeGridDay");
    // });
  };
}

document.addEventListener("DOMContentLoaded", function() {
  const iTicketSoftCalendar = new TicketSoftCalendar();
  const events = [
    {
      title: "event 1",
      start: "2020-01-01 10:45:00",
      end: "2020-01-01 12:45:00",
      type: "room1",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 2",
      start: "2020-01-01 10:45:00",
      end: "2020-01-01 12:45:00",
      type: "room1",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 3",
      start: "2020-01-01 10:45:00",
      end: "2020-01-01 12:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 4",
      start: "2020-01-01 15:45:00",
      end: "2020-01-01 19:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 5",
      start: "2020-01-01 10:45:00",
      end: "2020-01-01 12:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-01 10:45:00",
      end: "2020-01-01 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 7",
      start: "2020-01-01 10:00:00",
      end: "2020-01-01 12:45:00",
      type: "room3",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 8",
      start: "2020-01-01 09:45:00",
      end: "2020-01-01 18:45:00",
      type: "room3",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 9",
      start: "2020-01-13 10:00:00",
      end: "2020-01-13 15:45:00",
      type: "room4",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 10",
      start: "2020-01-13 10:00:00",
      end: "2020-01-13 12:45:00",
      type: "room5",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 11",
      start: "2020-01-13 10:10:00",
      end: "2020-01-13 18:45:00",
      type: "room6",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 5",
      start: "2020-01-06 10:45:00",
      end: "2020-01-01 12:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-06 10:45:00",
      end: "2020-01-06 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 7",
      start: "2020-01-06 10:00:00",
      end: "2020-01-06 12:45:00",
      type: "room3",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 8",
      start: "2020-01-04 09:45:00",
      end: "2020-01-04 18:45:00",
      type: "room3",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 10",
      start: "2020-01-13 10:00:00",
      end: "2020-01-13 12:45:00",
      type: "room5",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 11",
      start: "2020-01-20 10:10:00",
      end: "2020-01-20 18:45:00",
      type: "room6",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 5",
      start: "2020-01-20 10:45:00",
      end: "2020-01-20 12:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-20 10:45:00",
      end: "2020-01-20 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 7",
      start: "2020-01-20 10:00:00",
      end: "2020-01-20 12:45:00",
      type: "room3",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 123123",
      start: "2020-01-21 09:45:00",
      end: "2020-01-21 18:45:00",
      type: "room3",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 11",
      start: "2020-01-16 10:10:00",
      end: "2020-01-16 18:45:00",
      type: "room6",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 5",
      start: "2020-01-16 10:45:00",
      end: "2020-01-16 12:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-16 10:45:00",
      end: "2020-01-16 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    }
  ];
  iTicketSoftCalendar.updateEvents(events);
  // setTimeout(() => {
  //   var eventSources = calendar.getEventSources();
  //   eventSources.every(eventSource => eventSource.remove());
  //   setTimeout(() => {
  //     calendar.addEvent({
  //       title: "event 11",
  //       start: "2020-01-13 10:10:00",
  //       end: "2020-01-13 18:45:00"
  //     });
  //   }, 2000);
  // }, 4000);
});
