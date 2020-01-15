import { Calendar, DateEnv } from "@fullcalendar/core";
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

  /**
   * Display messages before calendar view by range dates
   */
  messages = [
    {
      startTime: new Date("2020-01-01"),
      endTime: new Date("2020-01-01"),
      text: "message for days between - 2020-01-01 - 2020-01-01",
      displayInViewTypes: [""]
    },
    {
      startTime: new Date("2020-01-01"),
      endTime: new Date("2020-01-01"),
      text: "message for days between - 2020-01-01 - 2020-01-01",
      displayInViewTypes: [""]
    },
    {
      startTime: new Date("2020-01-14"),
      endTime: new Date("2020-01-14"),
      text: "message for days between - 2020-01-14 - 2020-01-14",
      displayInViewTypes: [""]
    },
    {
      startTime: new Date("2020-01-22"),
      endTime: new Date("2020-01-22"),
      text: "message for days between - 2020-01-22 - 2020-01-22",
      displayInViewTypes: [""]
    },
    {
      startTime: new Date("2020-01-20"),
      endTime: new Date("2020-01-20"),
      text: "message for days between - 2020-01-20 - 2020-01-20",
      displayInViewTypes: [""]
    }
  ];

  constructor() {
    this.render();
    this.renderDatePicker();
    this.appendFilterSelectButton();
    this.attachEventCloseModalButton();
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
      },
      i18n: {
        previousMonth: "Mes anterior",
        nextMonth: "Mes siguiente",
        months: [
          "ינואר",
          "פבואר",
          "מרץ",
          "אפריל",
          "מאי",
          "יוני",
          "יולי",
          "אוגוסט",
          "ספטמבר",
          "אוקוטובר",
          "נובמבר",
          "דצמבר"
        ],
        weekdays: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
        weekdaysShort: [
          "ראשון",
          "שני",
          "שלישי",
          "רביעי",
          "חמישי",
          "שישי",
          "שבת"
        ]
      }
    });
  };

  openModal = event => {
    const modalElm = document.getElementById("modal");
    modalElm.classList.add("open");
  };

  closeModal = event => {
    const modalElm = document.getElementById("modal");
    modalElm.classList.remove("open");
  };

  render = () => {
    const calendarEl = document.getElementById("calendar");
    this.calendar = new Calendar(calendarEl, {
      nowIndicator: true,
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
      buttonText: {
        today: "היום",
        month: "חודש",
        week: "שבוע",
        day: "יום"
      },
      customButtons: {
        datepicker: {
          text: "לוח שנה",
          click: function() {}
        }
      },
      views: {
        week: {
          titleFormat: {
            month: "short",
            year: "numeric",
            day: "numeric",
            weekday: "short"
          }
        },
        day: {
          titleFormat: {
            month: "short",
            year: "numeric",
            day: "numeric",
            weekday: "short"
          }
        }
      },
      eventClick: event => {
        this.openModal(event);
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
      },
      select: info => {
      },
      datesRender: info => {

        const currentStart = info.view.currentStart;
        const currentEnd = info.view.currentEnd;
        let messageElm = document.getElementById("messages");

        if (messageElm) {
          messageElm.innerHTML = "";
        } else {
          messageElm = document.createElement("ul");
          messageElm.setAttribute("id", "messages");
          info.el.parentNode.insertBefore(messageElm, info.el);
        }

        this.messages.forEach(message => {
          if (
            currentStart <= message.startTime &&
            currentEnd >= message.endTime
          ) {
            const li = document.createElement("li");
            li.innerHTML = message.text;
            messageElm.appendChild(li);
          }
        });
      }
    });

    this.calendar.render();
  };

  attachEventCloseModalButton = () => {
    const closeModalButtonElm = document.getElementById("close-modal-button");
    closeModalButtonElm.addEventListener("click", () => {
      modal.classList.remove("open");
    });
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
    },
    {
      title: "event 6",
      start: "2020-01-28 10:45:00",
      end: "2020-01-28 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-28 10:45:00",
      end: "2020-01-28 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-28 10:45:00",
      end: "2020-01-28 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-28 10:45:00",
      end: "2020-01-28 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-28 10:45:00",
      end: "2020-01-28 15:45:00",
      type: "room2",
      extendedProps: {
        type: "room3"
      }
    },
    {
      title: "event 6",
      start: "2020-01-28 10:45:00",
      end: "2020-01-28 15:45:00",
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
