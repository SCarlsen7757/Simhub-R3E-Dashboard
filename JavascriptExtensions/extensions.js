
//Race number
const raceNumber = 57;

//On screen RPM gauge
const showRpmGauge = true;

//Delta settings
const deltaGood = '#FF32CD32';
const deltaBad = '#FFFF4500';
const deltaNeutral = '#FF262626';
const deltaTextInvalid = '#FFFF4500';
const deltaTextValid = '#FFFFFFFF';

//Lap time settings
const notRun = '#FF101211';
const slow = '#FFFFD500';
const personalBest = '#FF3FD93F';
const overAllClassBest = '#FF0000FF';
const overAllBest = '#FFAF28D1';
const invalid = '#FFFF4500';

//Leaderboard settings
const playerColor = '#FFFFE04C';

//Tyre compound colors
const soft = '#FFFF0000';
const medium = '#FFFFD500';
const hard = '#FFFFFFFF';

//Flag colors
const yellowFlag = '#FFFFE04C';
const greenFlag = '#FF00D901';
const blueFlag = '#FF00BFFF';
const whiteFlag = '#FFFFFFFF';

//General colors
const black = '#FF000000';
const white = '#FFFFFFFF';

//SOC colors
const socColor = '#FF32CD32';
const socLowColor = '#FFFF4500';

//Center Widget colors
const noRpmFlash = '#FF262626';
const thresholdRpm = '#FF32CD32';
const rpmFlash = '#FFFF4500';

function isEven(number) {
    return number % 2 === 0;
}

function isPractice() {
    return $prop('DataCorePlugin.GameData.SessionTypeName') == 'Practice';
}

function isQualify() {
    return $prop('DataCorePlugin.GameData.SessionTypeName') == 'Qualify';
}

function isRace() {
    return $prop('DataCorePlugin.GameData.SessionTypeName') == 'Race';
}

function r3e_showRpmGauge() {
    if (!showRpmGauge) {return false; }
    return true;
}

function r3e_formatName(name) {
    if (name != null) {

        name = name.replace('�0', 'E'); // replace unicode characters

        var full_name = name.split(' ');
        var first_name = full_name.shift();
        var last_name = full_name;
        return first_name.substr(0, 1) + '. ' + last_name.join(" ")
    } else {
        return ''
    }
}

function ld_formatTimeShort(time) {
    if (time > -10 && time < 10) {
        return format(time, '0.00', true)
    } else if (time > -100 && time < 100) {
        return format(time, '00.0', true)
    } else {
        return format(time, '000', true)
    }
}

function ld_formatTime(time) {
    if (time > -10 && time < 10) {
        return format(time, '0.000', true)
    } else if (time > -100 && time < 100) {
        return format(time, '00.00', true)
    } else if (time > -1000 && time < 1000) {
        return format(time, '000.0', true)
    } else {
        return format(time, '000', true)
    }
}

function r3e_lastLapColor(pos = null) {
    let racePosition;

    if (pos === null) {
        racePosition = getplayerleaderboardposition();
    }
    else {
        racePosition = pos;
    }

    const lastLapTime = timespantoseconds(driverlastlap(racePosition));
    if (lastLapTime === null || lastLapTime <= 0) { return notRun; }

    const leaderBestLapTime = $prop('DataCorePlugin.GameRawData.LapTimeBestLeader').toFixed(3);
    if (leaderBestLapTime === null || leaderBestLapTime <= 0) { return overAllBest; }

    const classLeaderBestLapTime = $prop('DataCorePlugin.GameRawData.LapTimeBestLeaderClass').toFixed(3);
    if (classLeaderBestLapTime === null || classLeaderBestLapTime <= 0) { return overAllClassBest; }

    const bestLapTime = timespantoseconds(driverbestlap(racePosition));
    if (bestLapTime === null || bestLapTime <= 0) { return personalBest; }

    if (lastLapTime <= leaderBestLapTime) { return overAllBest; }
    if (lastLapTime <= classLeaderBestLapTime) { return overAllClassBest; }
    if (lastLapTime <= bestLapTime) { return personalBest; }
    return slow;
}

function r3e_bestLapColor(pos = null) {
    let racePosition;

    if (pos === null) {
        racePosition = getplayerleaderboardposition();
    }
    else {
        racePosition = pos;
    }
    const bestLapTime = timespantoseconds(driverbestlap(racePosition));
    if (bestLapTime === null || bestLapTime <= 0) { return notRun; }

    const leaderBestLapTime = $prop('DataCorePlugin.GameRawData.LapTimeBestLeader').toFixed(3);
    if (leaderBestLapTime === null || leaderBestLapTime <= 0) { return notRun; }

    const classLeaderBestLapTime = $prop('DataCorePlugin.GameRawData.LapTimeBestLeaderClass').toFixed(3);
    if (classLeaderBestLapTime === null || classLeaderBestLapTime <= 0) { return notRun; }

    if (bestLapTime <= leaderBestLapTime) { return overAllBest; }
    if (bestLapTime <= classLeaderBestLapTime) { return overAllClassBest; }
    return personalBest;
}

function r3e_estimatedLapColor() {
    const estLapTime = timespantoseconds(r3e_estimatedLapTime());
    if (estLapTime === null || estLapTime <= 0) { return notRun; }

    if (!r3e_lapValid()) { return invalid; }

    let leaderBestLapTime = $prop('DataCorePlugin.GameRawData.LapTimeBestLeader').toFixed(3);
    if (leaderBestLapTime === null || leaderBestLapTime < 0) { leaderBestLapTime = 0; }

    let classLeaderBestLapTime = $prop('DataCorePlugin.GameRawData.LapTimeBestLeaderClass').toFixed(3);
    if (classLeaderBestLapTime === null || classLeaderBestLapTime < 0) { classLeaderBestLapTime = 0; }

    let bestLapTime = timespantoseconds(driverbestlap(getplayerleaderboardposition()));
    if (bestLapTime === null || bestLapTime < 0) { bestLapTime = 0; }

    if (estLapTime <= leaderBestLapTime) { return overAllBest; }
    if (estLapTime <= classLeaderBestLapTime) { return overAllClassBest; }
    if (estLapTime <= bestLapTime) { return personalBest; }
    return slow;
}

function r3e_estimatedLapTime() {
    const driverPosition = getplayerleaderboardposition()
    if (driverisoutlap(driverPosition)) { return secondstotimespan(0); }
    else if (driveriscarinpit(driverPosition)) { return secondstotimespan(0); }
    else if (driveriscarinpitlane(driverPosition)) { return secondstotimespan(0); }

    const allTimeBest = $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
    const sessionBest = $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased');

    if (sessionBest != secondstotimespan(0)) {
        return sessionBest;
    }
    else {
        return allTimeBest;
    }
}

function r3e_lapValid() {
    return $prop('GameRawData.LapValidState') == 0;
}

function r3e_delta() {
    const allTimeBestDelta = $prop('PersistantTrackerPlugin.AllTimeBestLiveDeltaSeconds');
    const sessionBestDelta = $prop('PersistantTrackerPlugin.SessionBestLiveDeltaSeconds');

    if (sessionBestDelta > 0) {
        return sessionBestDelta;
    }
    else {
        return allTimeBestDelta;
    }
}

function r3e_deltaColor() {
    if (!r3e_lapValid()) { return deltaNeutral; }

    const delta = r3e_delta();
    if (delta > 0.0) {
        return deltaBad;
    } else if (delta < 0.0) {
        return deltaGood;
    } else {
        return deltaNeutral;
    }
}

function r3e_deltaTextColor() {
    if (r3e_lapValid()) {
        return deltaTextValid;
    } else {
        return deltaTextInvalid;
    }
}

function standingRacePosition(index, maxRow) {
    const playerPosition = getplayerleaderboardposition();
    const playercount = $prop('DataCorePlugin.GameData.OpponentsCount');
    const frozenTopPositions = 3;
    const maxsCarsToShowBehind = 2;

    if (index <= frozenTopPositions || playerPosition <= (maxRow - maxsCarsToShowBehind)) { //Player can be shown on leaderboard
        return index;
    } else {
        const slotSize = maxRow - frozenTopPositions;
        const carsBehind = playercount - playerPosition;
        const carsBehindToShow = carsBehind < maxsCarsToShowBehind ? carsBehind : maxsCarsToShowBehind;
        const slotStartPosition = playerPosition - slotSize + carsBehindToShow + 1; //Plus 1 to hit the correct race position

        return slotStartPosition + (index - (frozenTopPositions + 1));
    }
}

function r3e_standingPositionText(index, maxRow) {
    return standingRacePosition(index, maxRow);
}

function r3e_standingPositionColor(index, maxRow) {
    const pos = standingRacePosition(index, maxRow);
    return driverisplayer(pos) ? playerColor : drivercarclasscolor(pos);
}

function r3e_standingPositionTextColor(index, maxRow) {
    const pos = standingRacePosition(index, maxRow);
    return driverisplayer(pos) ? black : drivercarclasstextcolor(pos);
}

function r3e_standingCarNumberText(index, maxRow) {
    return '#' + drivercarnumber(standingRacePosition(index, maxRow));
}

function r3e_standingCarNumberTextColor(index, maxRow) {
    return driverisplayer(standingRacePosition(index, maxRow)) ? playerColor : white;
}

function r3e_standingDriverNameText(index, maxRow) {
    return r3e_formatName(drivername(standingRacePosition(index, maxRow)));
}

function r3e_standingDriverNameTextColor(index, maxRow) {
    return driverisplayer(standingRacePosition(index, maxRow)) ? playerColor : white;
}

function r3e_standingGapAbsoluteText(index, maxRow) {
    const position = standingRacePosition(index, maxRow)

    if (isRace()) {
        if (position == 1) {
            return 'L' + drivercurrentlap(position);
        }
        const bestLapTime = timespantoseconds($prop("BestLapTime"));
        const gapToLeader = drivergaptoleader(position);
        if (bestLapTime <= 0) {
            return ld_formatTime(gapToLeader);
        }
        const gapToLeaderLaps = drivercurrentlap(1) - drivercurrentlap(position);
        if (gapToLeaderLaps == null || gapToLeaderLaps <= 0) {
            return ld_formatTime(gapToLeader);
        }
        return "+L" + gapToLeaderLaps;
    } else {
        let gap = driverdeltatobest(position);
        if ((gap == 0 || gap == null) && timespantoseconds(driverbestlap(position)) > 0) {
            return format(driverbestlap(position), 'm\\:ss\\.fff', false)
        } else {
            return ld_formatTime(gap)
        }
    }
}

function r3e_gapBetweenPostions(racepostion1, racepostion2) {
    return drivergaptoleader(racepostion2) - drivergaptoleader(racepostion1);
}

function r3e_standingGapRelativeText(index, maxRow) {
    const position = standingRacePosition(index, maxRow)

    if (isRace()) {
        if (position == 1) {
            return 'L' + drivercurrentlap(position);
        }
        const gap = r3e_gapBetweenPostions(position - 1, position);
        return ld_formatTime(gap);

    } else {

        if (position == 1) {
            return format(driverbestlap(position), 'm\\:ss\\.fff', false)
        }
        const gap = timespantoseconds(driverdeltatobest(position - 1)) - timespantoseconds(driverdeltatobest(position));
        return ld_formatTime(gap)
    }
}

function r3e_standingGapTextColor(index, maxRow) {
    return driverisplayer(standingRacePosition(index, maxRow)) ? playerColor : white;
}

function r3e_frontTireSubTypeColor() {
    switch ($prop("GameRawData.TireSubtypeFront")) {
        case 2: return soft;
        case 3: return medium;
        case 4: return hard;
        default: return hard;
    }
}

function r3e_rearTireSubTypeColor() {
    switch ($prop("GameRawData.TireSubtypeRear")) {
        case 2: return soft;
        case 3: return medium;
        case 4: return hard;
        default: return hard;
    }
}

function r3e_yellowSectorShow(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) return false;
    return $prop('DataCorePlugin.GameRawData.Flags.SectorYellow.Sector' + sectorNumber) > 0
}

function r3e_yellowSectorText(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }
    if ($prop("GameRawData.NumPenalties") > 0) { return ''; } //Suppress text on yellow sector. To show current penalty.
    return 'S' + sectorNumber;
}

function r3e_rpmRedLineReachedBlink() {
    return blink('r3eDashGearRpmBlink', 300, $prop("CarSettings_RPMRedLineReached"));
}

function r3e_centerWidgetBacgroundColor() {
    if ($prop('DataCorePlugin.GameRawData.VehicleInfo.EngineType') == 1) { return noRpmFlash; }
    if ($prop('DataCorePlugin.GameData.CarSettings_MaxGears') == $prop('DataCorePlugin.GameData.Gear')) { return noRpmFlash; }
    const shiftLight2 = $prop('DataCorePlugin.GameData.CarSettings_RPMShiftLight2');
    if (shiftLight2 > 0.3 && shiftLight2 < 1) { return thresholdRpm; }
    if (r3e_rpmRedLineReachedBlink()) { return rpmFlash; }
    return noRpmFlash;
}

function r3e_sectorGainOpponent(index, opponentPosition) {
    const opponentSectorTime = timespantoseconds(driversectorlastlap(opponentPosition), index, false);
    if (opponentSectorTime === null || opponentSectorTime <= 0) { return 0; }

    const playerSectorTime = timespantoseconds(driversectorlastlap(getplayerleaderboardposition(), index, false));

    return opponentSectorTime - playerSectorTime;
}

function r3e_sectorGainOpponentColor(index, opponentPosition) {
    const gain = r3e_sectorGainOpponent(index, opponentPosition);
    if (gain < 0) {
        return deltaGood;
    } else if (gain > 0) {
        return deltaBad;
    } else {
        return deltaNeutral;
    }
}

function r3e_bestSectorGap(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }
    const sessionBestSector = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeLeaderClass.Sector' + sectorNumber).toFixed(3);
    const playerBestSector = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeSelf.Sector' + sectorNumber).toFixed(3);

    return secondstotimespan(playerBestSector - sessionBestSector);
}

function r3e_bestSectorGapColor(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }

    const delta = timespantoseconds(r3e_bestSectorGap(sectorNumber));

    if (delta < 0) {
        return deltaGood;
    } else if (delta > 0) {
        return deltaBad;
    } else {
        return deltaNeutral;
    }
}

function r3e_playerBestSector(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }
    const time = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeSelf.Sector' + sectorNumber).toFixed(3);
    if (time >= 0) {
        return secondstotimespan(time);
    } else {
        return secondstotimespan(0);
    }
}

function r3e_sessionClassBestSector(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }
    const time = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeLeaderClass.Sector' + sectorNumber).toFixed(3);
    if (time >= 0) {
        return secondstotimespan(time);
    } else {
        return secondstotimespan(0);
    }
}

function r3e_playerLastSector(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }
    const time = driversectorlastlap(getplayerleaderboardposition(), sectorNumber, false);
    if (time !== null) {
        return time;
    } else {
        return secondstotimespan(0);
    }
}

function r3e_playerLastSectorColor(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }

    const bestLeaderSector = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeLeader.Sector' + sectorNumber).toFixed(3);
    const bestClassLeaderSector = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeLeaderClass.Sector' + sectorNumber).toFixed(3);
    const bestSector = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeSelf.Sector' + sectorNumber).toFixed(3);
    const lastSector = timespantoseconds(driversectorlastlap(getplayerleaderboardposition(), sectorNumber, false));

    if (lastSector === null) { return notRun; }

    if (lastSector <= bestLeaderSector) { return overAllBest; }
    if (lastSector <= bestClassLeaderSector) { return overAllClassBest; }
    if (lastSector <= bestSector) { return personalBest; }
    return slow;
}

function r3e_lastSectorGap(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }
    const playerLastSector = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeSelf.Sector' + sectorNumber).toFixed(3);
    if (playerLastSector < 0) { return secondstotimespan(0); }
    const sessionBestSector = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeLeaderClass.Sector' + sectorNumber).toFixed(3);

    return secondstotimespan(playerLastSector - sessionBestSector);
}

function r3e_lastSectorGapColor(sectorNumber) {
    if (sectorNumber < 1 || sectorNumber > 3) { return ''; }
    const lastSector = $prop('DataCorePlugin.GameRawData.BestIndividualSectorTimeSelf.Sector' + sectorNumber);
    if (lastSector < 0) { return deltaNeutral; }

    const delta = timespantoseconds(r3e_lastSectorGap(sectorNumber));

    if (delta < 0) {
        return deltaGood;
    } else if (delta > 0) {
        return deltaBad;
    } else {
        return deltaNeutral;
    }
}