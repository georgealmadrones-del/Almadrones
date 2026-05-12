let Processes = [];


//PROCESS INPUT
function AddProcess() {
    const PID = document.getElementById("PID").value;
    const AT = parseInt(document.getElementById("AT").value);
    const BT = parseInt(document.getElementById("BT").value);
    const Pri = parseInt(document.getElementById("Pri").value);

    if (PID === "" || isNaN(AT) || isNaN(BT) || isNaN(Pri)) {
        alert("Please fill in all fields with valid data.");
        return;
    }

    const isDuplicate = Processes.some(p => p.PID === PID);

    if (isDuplicate) {
        alert("Error: Process ID " + PID + " is already in use. Please enter a unique ID.");
        return;
    }
        
    const NewProcess = {
        PID: PID,
        AT: AT,
        BT: BT,
        Pri: Pri,
        RemainingBT: BT
    };

    Processes.push(NewProcess);

    const tableBody = document.querySelector("#InputTable tbody");
    const NewRow = `
                    <tr>
                        <td>${PID}</td>
                        <td>${AT}</td>
                        <td>${BT}</td>
                        <td>${Pri}</td>
                    </tr>`;
    tableBody.innerHTML += NewRow;

    document.getElementById("PID").value = "";
    document.getElementById("AT").value = "";
    document.getElementById("BT").value = "";
    document.getElementById("Pri").value = "";
}


//ALGORITHM SELECTION
function RunSimulator() {
    const ScheduleType = document.querySelector("select").value;
    const isPreemptive = (ScheduleType === "Preemptive");

    let CurrentTime = 0;
    let CompletedCount = 0;
    let TotalProcesses = Processes.length;

    let Results = [];
    let GanttCHartData = [];

    let Queue = Processes.map (p => ({...p}));
    

// SIMULATION LOGIC
    while (CompletedCount < TotalProcesses) {
        let ReadyQueue = Queue.filter (p => p.AT <= CurrentTime && p.RemainingBT > 0);

        if (ReadyQueue.length > 0) {
            ReadyQueue.sort((a, b) => a.Pri - b.Pri);
            let TempProcess = ReadyQueue[0];

            let StartTime = CurrentTime;

            if (isPreemptive) {
                TempProcess.RemainingBT -=1;
                CurrentTime +=1;
            }
            else {
                CurrentTime += TempProcess.RemainingBT;
                TempProcess.RemainingBT = 0;
            }

            let EndTime = CurrentTime;

            if (GanttCHartData.length > 0 && GanttCHartData[GanttCHartData.length -1].PID === TempProcess.PID) {
                GanttCHartData[GanttCHartData.length - 1].EndTime = EndTime;
            }
            else {
                GanttCHartData.push({PID: TempProcess.PID, StartTime: StartTime, EndTime: EndTime});
            }

            if (TempProcess.RemainingBT === 0) {
                TempProcess.CT = CurrentTime;

                TempProcess.TAT = TempProcess.CT - TempProcess.AT;
                TempProcess.WT = TempProcess.TAT - TempProcess.BT;
                Results.push(TempProcess);
                CompletedCount++;
            }
        }
        else {
            let StartTime = CurrentTime;
            CurrentTime++;

            if (GanttCHartData.length > 0 && GanttCHartData[GanttCHartData.length - 1].PID === "Idle") {
                GanttCHartData[GanttCHartData.length -1].EndTime = CurrentTime;
            }
            else {
                GanttCHartData.push({PID: "Idle", StartTime:StartTime, EndTime: CurrentTime});
            }
        }
    }



    UpdateResultsTable(Results);
    GanttChart(GanttCHartData);


    //AVERAGES
    let TotalTAT = 0;
    let TotalWT = 0;

    Results.forEach (p => {
        TotalTAT += p.TAT;
        TotalWT += p.WT;
    });

    const AvgTAT = (TotalTAT / TotalProcesses).toFixed(2);
    const AvgWT = (TotalWT / TotalProcesses).toFixed(2);
    
    const display = document.getElementById("AVG-Results");
    display.innerHTML = `
        <h1>Average Turnaround Time: ${TotalTAT} / ${TotalProcesses} = ${AvgTAT} ms</h1>
        <h1>Average Waiting Time: ${TotalWT} / ${TotalProcesses} = ${AvgWT} ms</h1>`;
}



//OUTPUT METRICS
function UpdateResultsTable(data) {
    const ResultsBody = document.querySelector("#ResultsTable tbody");
    if (!ResultsBody) return;

    ResultsBody.innerHTML = "";
    data.forEach(p => {
        const row = `
            <tr>
                <td>${p.PID}</td>
                <td>${p.AT}</td>
                <td>${p.BT}</td>
                <td>${p.Pri}</td>
                <td>${p.CT}</td>
                <td>${p.TAT}</td>
                <td>${p.WT}</td>
            </tr>`;
        ResultsBody.innerHTML += row;
    });
}


//GANNT CHART VISUALIZATION
function GanttChart(data) {
    const container = document.getElementById("Gantt-Chart");
    container.innerHTML = "";

    data.forEach(item => {
        const block = document.createElement("div");
        block.className = Gantt-Block ${item.PID === "Idle" ? "idle" : ""};
        
        block.style.backgroundColor = getProcessColor(item.PID);

        const duration = item.EndTime - item.StartTime;
        block.style.width = (duration * 30) + "px";

        block.innerHTML = `
            <span>${item.PID}</span>
            <div class="Time-Label Start-Time">${item.StartTime}</div>
            <div class="Time-Label End-Time">${item.EndTime}|</div>
        `;
        container.appendChild(block);
    });
}

//GANTT CHART COLOR SCHEME
function getProcessColor(PID) {
    if (PID === "Idle") return "#3b3939";
    const colors = ["#ff0000","#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee", "#800080"];
    let hash = 0;
    for (let i = 0; i < PID.length; i++) {
        hash = PID.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

