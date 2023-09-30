import React, { useState, useEffect } from "react";
import json from "./data.json";
const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timezone, setTimezone] = useState("Local Time");
  const [jsonData, setJsonData] = useState([]);
  useEffect(() => {
    // Set the data from the imported JSON into the state
    setJsonData(json);
  }, []);
  const showPrevWeek = () => {
    const prevWeekDate = new Date(currentDate);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    setCurrentDate(prevWeekDate);
  };

  const showNextWeek = () => {
    const nextWeekDate = new Date(currentDate);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    setCurrentDate(nextWeekDate);
  };

  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    return startOfWeek;
  };

  const convertToTimezone = (date) => {
    if (timezone === "GMT") {
      return date.toGMTString().split(" ")[4];
    } else {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  useEffect(() => {
    const startOfCurrentWeek = getStartOfWeek(new Date());
    setCurrentDate(startOfCurrentWeek);
  }, []);

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timeSlots = [];
  const startTime = new Date();
  startTime.setHours(8, 0, 0); // Start at 8:00am

  const endTime = new Date();
  endTime.setHours(23, 0, 0); // End at 11:00pm

  while (startTime <= endTime) {
    const timeString = convertToTimezone(startTime);
    timeSlots.push(timeString);
    startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 30 minutes
  }

  const isSlotChecked = (weekday, timeSlot) => {
    const formattedDate = `${
      currentDate.getDate() + weekdays.indexOf(weekday)
    }-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    return jsonData.some((item) => {
      return item.Date === formattedDate && item.Time === timeSlot;
    });
  };

  const handleTimezoneChange = (event) => {
    setTimezone(event.target.value);
  };
  const timeSlotRows = Array(Math.ceil(timeSlots.length / 5))
    .fill(null)
    .map((_, rowIndex) => timeSlots.slice(rowIndex * 5, (rowIndex + 1) * 5));
  const tableHeaderStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  };

  const dayCellStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  };

  const pastCellStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#ccc",
  };

  const timeSlotCellStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button onClick={showPrevWeek}>Prev Week</button>
        <div>{new Date().toLocaleDateString()}</div>
        <button onClick={showNextWeek}>Next Week</button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="timezone">Select Timezone: </label>
        <select id="timezone" onChange={handleTimezoneChange} value={timezone}>
          <option value="Local Time">Local Time</option>
          <option value="GMT">GMT</option>
        </select>
      </div>
      {/* <table style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Day</th>
          </tr>
        </thead>
        <tbody>
          {weekdays.map((weekday, index) => (
            <tr key={index}>
              <td>
                {`${weekday} ${currentDate.getDate() + index}/${
                  currentDate.getMonth() + 1
                }`}
              </td>

              {new Date() >
              new Date(
                `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${
                  currentDate.getDate() + index
                }`
              )
                ? "past"
                : timeSlotRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((timeSlot, cellIndex) => (
                        <td key={cellIndex} className="time-slot-cell">
                          {timeSlot}
                          <input
                            type="checkbox"
                            checked={isSlotChecked(weekday, timeSlot)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
            </tr>
          ))}
        </tbody>
      </table> */}
      <table
        style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Day</th>
          </tr>
        </thead>
        <tbody>
          {weekdays.map((weekday, index) => (
            <tr key={index}>
              <td style={dayCellStyle}>
                {`${weekday} ${currentDate.getDate() + index}/${
                  currentDate.getMonth() + 1
                }`}
              </td>
              {new Date() >
              new Date(
                `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${
                  currentDate.getDate() + index
                }`
              ) ? (
                <td colSpan="3" style={pastCellStyle}>
                  past
                </td>
              ) : (
                <React.Fragment>
                  {timeSlotRows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((timeSlot, cellIndex) => (
                        <td key={cellIndex} style={timeSlotCellStyle}>
                          {timeSlot}
                          <input
                            type="checkbox"
                            checked={isSlotChecked(weekday, timeSlot)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
