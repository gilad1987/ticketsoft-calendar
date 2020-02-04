import { Calendar, DateEnv, debounce } from "@fullcalendar/core";
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

var moment = require("moment");
class TicketSoftCalendar {
  iCalendar;
  selectedEventType = 1;

  events = [];
  eventsGroupByType = {
    2: {
      type: 2,
      text: "חללים",
      options: {}
    },
    3: {
      type: 3,
      text: "מדריכים",
      options: {}
    },
    1: {
      type: 1,
      text: "פעילות",
      options: {}
    }
  };

  /**
   * Display messages before calendar view by range dates
   */
  messages = [
    {
      startTime: new Date("2020-01-01"),
      endTime: new Date("2020-01-01"),
      text: "message for days between - 2020-01-01 - 2020-01-01"
    },
    {
      startTime: new Date("2020-01-01"),
      endTime: new Date("2020-01-01"),
      text: "message for days between - 2020-01-01 - 2020-01-01"
    },
    {
      startTime: new Date("2020-01-14"),
      endTime: new Date("2020-01-14"),
      text: "message for days between - 2020-01-14 - 2020-01-14"
    },
    {
      startTime: new Date("2020-01-22"),
      endTime: new Date("2020-01-22"),
      text: "message for days between - 2020-01-22 - 2020-01-22"
    },
    {
      startTime: new Date("2020-01-20"),
      endTime: new Date("2020-01-20"),
      text: "message for days between - 2020-01-20 - 2020-01-20"
    }
  ];

  constructor() {
    this.render();
    this.renderDatePicker();
    // this.appendFilterSelectButton();
    this.attachEventCloseModalButton();
    this.generateData();
    this.filterEvents(1,'All')
  }
  updateEvents = events => {
    this.events = events;
    this.clearAllEvents();
    this.renderEvents(events);
  };

  filterEvents = (filterKey, filterValue) => {
    const events =
      filterValue === "All"
        ? this.events.filter(
            _event => _event.extendedProps.type_id === this.selectedEventType
          )
        : this.events.filter(
          _event => _event.extendedProps.type_id === this.selectedEventType
        ).filter(
            _event => _event.extendedProps[filterKey] === Number(filterValue)
          );
    this.renderEvents(events);
    return events;
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

  clearTypeFilterButtonsSelection = () => {
    const buttons = Array.prototype.slice.call(
      document.querySelectorAll('[class*="Select-button"]')
    );
    buttons.forEach(button => button.classList.remove("fc-button-active"));
  };

  setSelectedFilterTypeButton = elem => {
    elem.classList.add("fc-button-active");
  };

  dayRender = () => {
    if (this.calendar.view.type !== "timeGridDay") {
      return;
    }

    const wrapperElm = document.querySelector(".fc-slats");
    const wrapperColumns = document.createElement("div");
    wrapperColumns.classList.add("wrapperColumns");

    if (document.querySelector(".wrapperColumns")) {
      document.querySelector(".wrapperColumns").remove();
    }

    const entries = Object.entries(
      this.eventsGroupByType[this.selectedEventType].options
    );
    for (const [id, value] of entries) {
      const column = document.createElement("div");
      column.id = `${this.getCurrentType()}_${id}`;
      column.classList.add("column");
      column.innerText = value;
      wrapperColumns.appendChild(column);
    }
    wrapperElm.appendChild(wrapperColumns);
  };

  getDateDiff = (start, end) => {
    var diffMs = end - start; // milliseconds between now & Christmas
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    return {
      diffDays,
      diffHrs,
      diffMins
    };
  };

  moveEventToColumn = ({
    el,
    activity_id,
    guide_id,
    room_id,
    type_id,
    event
  }) => {
    const currentId =
      this.selectedEventType === 1
        ? activity_id
        : this.selectedEventType === 2
        ? room_id
        : guide_id;

    const column = document.querySelector(
      `#${this.getCurrentType()}_${currentId}.column`
    );

    if (column) {
      //const dateDiff = this.getDateDiff(event.start,event.end);
      const diff = Math.abs(event.end- event.start);
      const minutes = Math.floor((diff/1000)/60);
      const minuteHeight = column.clientHeight/(24*60);
      el.style.height = `${minuteHeight*minutes}px`;
      column.appendChild(el);
    }
    // const entries = Object.entries(
    //   this.eventsGroupByType[this.selectedEventType].options
    // );
    // for (const [id, value] of entries) {
    //   const eventElm = document.querySelector(`.type_id_${id}`);
    //   if(!eventElm){
    //     continue;
    //   }
    //   const column = document.querySelector(`#column_${id}.column`);
    //   column.appendChild(eventElm);
    // }
  };

  getCurrentType = () => {
    return this.selectedEventType === 1
      ? "activity"
      : this.selectedEventType === 2
      ? "room"
      : "guide";
  };

  render = () => {
    const calendarEl = document.getElementById("calendar");
    this.calendar = new Calendar(calendarEl, {
      eventPositioned: function(info) {},
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
        right:
          "dayGridMonth,timeGridWeek,timeGridDay activitySelect,guideSelect,roomSelect"
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
          click: event => {}
        },
        activitySelect: {
          text: "פעילות",
          click: event => {
            this.clearTypeFilterButtonsSelection();
            this.setSelectedFilterTypeButton(event.target);
            this.selectedEventType = 1;
            this.filterEvents("type", "All");
            this.appendFilterSelectButton();
            this.dayRender();
          }
        },
        guideSelect: {
          text: "מדריכים",
          click: event => {
            this.clearTypeFilterButtonsSelection();
            this.setSelectedFilterTypeButton(event.target);
            this.selectedEventType = 3;
            this.filterEvents("type", "All");
            this.appendFilterSelectButton();
            this.dayRender();
          }
        },
        roomSelect: {
          text: "חללים",
          click: event => {
            this.clearTypeFilterButtonsSelection();
            this.setSelectedFilterTypeButton(event.target);
            this.selectedEventType = 2;
            this.filterEvents("type", "All");
            this.appendFilterSelectButton();
            this.dayRender();
          }
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
        console.log('eventClick');
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
      select: info => {},
      dayRender: dayRenderInfo => {
        this.dayRender(dayRenderInfo);
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
      },
      eventRender: ({ el, event }) => {
        if (this.calendar.view.type !== "timeGridDay") {
          return;
        }
        console.log(event);
        const classes = [
          `activity_id_${event.extendedProps.activity_id}`,
          `guide_id_${event.extendedProps.guide_id}`,
          `room_id_${event.extendedProps.room_id}`,
          `type_id_${event.extendedProps.type_id}`
        ];
        el.classList.add(...classes);

        setTimeout(
          () => this.moveEventToColumn({ el, event, ...event.extendedProps }),
          0
        );
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

  generateData = () => {
    const countEventToGenerate = 500;
    const events = [];

    function randomDate(start, end) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      );
    }

    function randomNumber(min, max) {
      return Math.floor(Math.random() * max) + min;
    }

    for (let i = 0; i < countEventToGenerate; i++) {
      let start = moment(
        randomDate(new Date(2020, 0, 1), new Date(2020, 1, 30))
      ).hours(randomNumber(8, 12));
      let end = moment(start).add(randomNumber(1, 4), "hours");

      start = start.toDate();
      end = end.toDate();

      const activity_id = randomNumber(0, 10);
      const guide_id = randomNumber(0, 10);
      const room_id = randomNumber(0, 10);
      const type_id = randomNumber(1, 3);

      if (
        type_id === 1 &&
        !this.eventsGroupByType[type_id].options[activity_id]
      ) {
        this.eventsGroupByType[type_id].options[
          activity_id
        ] = `label activity_id: ${activity_id} `;
      }
      if (type_id === 2 && !this.eventsGroupByType[type_id].options[room_id]) {
        this.eventsGroupByType[type_id].options[
          room_id
        ] = `label room_id: ${room_id} `;
      }
      if (type_id === 3 && !this.eventsGroupByType[type_id].options[guide_id]) {
        this.eventsGroupByType[type_id].options[
          guide_id
        ] = `label guide_id: ${guide_id} `;
      }
      events.push({
        start,
        end,
        extendedProps: {
          activity_id,
          guide_id,
          room_id,
          type_id
        },
        title: `Event ${i} - activity_id:${activity_id}, guide_id:${guide_id}, room_id:${room_id}, type_id:${type_id}`

        // backgroundColor:`#${activity_id}${guide_id}${room_id}`,
        // borderColor:`#${activity_id}${guide_id}${room_id}`,
      });
    }
    this.updateEvents(events);
  };
  appendFilterSelectButton = () => {
    const select = document.createElement("select");
    select.addEventListener("change", event => {
      const filterValue = event.target.value;
      const filterKey =
        this.selectedEventType === 1
          ? "activity_id"
          : this.selectedEventType === 2
          ? "room_id"
          : "guide_id";
      this.filterEvents(filterKey, filterValue);
    });

    const opt = document.createElement("option");
    opt.value = "All";
    opt.innerText = "All";
    select.appendChild(opt);

    const entries = Object.entries(
      this.eventsGroupByType[this.selectedEventType].options
    );
    for (const [id, value] of entries) {
      const opt = document.createElement("option");
      opt.value = id;
      opt.innerText = value;
      select.appendChild(opt);
    }

    if (document.querySelector(".fc-right select")) {
      document.querySelector(".fc-right select").remove();
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

  //iTicketSoftCalendar.updateEvents(generateData());
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
