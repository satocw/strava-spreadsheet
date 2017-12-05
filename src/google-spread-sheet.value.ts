/**
 * １行目
 */
export function title(value: string) {
    return {
        "userEnteredValue": {
          "stringValue": value
        },
        "userEnteredFormat": {
            "textFormat": {
                "foregroundColor": {},
                "fontFamily": "arial,sans,sans-serif",
                "fontSize": 14,
                "bold": false,
                "italic": false,
                "strikethrough": false,
                "underline": false
            }
        }
    };
}

/**
 * ２行目
 */
export function headerCell(value: string) {
    return {
        "userEnteredValue": {
            "stringValue": value
        },
        "userEnteredFormat": {
            "backgroundColor": {
                "red": 0.9372549,
                "green": 0.9372549,
                "blue": 0.9372549
            },
            "borders": {
                "top": {
                  "style": "SOLID",
                  "width": 1,
                  "color": {}
                },
                "bottom": {
                  "style": "DOUBLE",
                  "width": 3,
                  "color": {}
                },
                "left": {
                  "style": "SOLID",
                  "width": 1,
                  "color": {}
                },
                "right": {
                  "style": "SOLID",
                  "width": 1,
                  "color": {}
                }
            }
        }
    };
}

/**
 * 日と曜日
 */
enum DAY {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
}

function fromNumberToStringDay(day: number): string {
    switch (day) {
        case DAY.SUNDAY:
            return '日';
        case DAY.MONDAY:
            return '月';
        case DAY.TUESDAY:
            return '火';
        case DAY.WEDNESDAY:
            return '水';
        case DAY.THURSDAY:
            return '木';
        case DAY.FRIDAY:
            return '金';
        case DAY.SATURDAY:
            return '土';
        default:
            throw new Error('Unexpected number');
    }
}

export function countDaysInMonth(year: number, month: number) {
    let date = 29;     // どの月も28日まではある
    while (true) {
        const last = new Date(year, month - 1, date);
        if (last.getMonth() !== month - 1) {    // 月が変わった
            break;
        }
        ++date;
    }
    return --date;
}

/**
 * @return
 * [
        {
            "values": ssDateAndDay(2017, 12, 1)
        },
        {
            "values": ssDateAndDay(2017, 12, 2)
        }
    ]
 */
export function dateAndDays(year: number, month: number) {
    let arr: any[] = [];
    const lastDate = countDaysInMonth(year, month);
    for (let date = 1; date <= lastDate; ++date) {
        arr.push({ "values": dateAndDay(year, month, date) });
    }
    return arr;
}

function dateAndDay(year: number, month: number, date: number) {
    const firstDate = new Date(year, month - 1);
    const firstDay = firstDate.getDay();
    const day = (firstDay + date - 1) % 7;
    if (day === DAY.SUNDAY) {
        return [
            {
                "userEnteredValue": {
                    "numberValue": date
                }
            },
            {
                "userEnteredValue": {
                    "stringValue": "日"
                },
                "userEnteredFormat": {
                    "textFormat": {
                        "foregroundColor": {
                            "red": 1
                        }
                    }
                }
            }
        ];
    }
    else if (day === DAY.SATURDAY) {
        return [
            {
                "userEnteredValue": {
                    "numberValue": date
                }
            },
            {
                "userEnteredValue": {
                    "stringValue": "土"
                },
                "userEnteredFormat": {
                    "textFormat": {
                        "foregroundColor": {
                            "blue": 1
                        }
                    }
                }
            }
        ];
    }
    else {
        return [
            {
                "userEnteredValue": {
                    "numberValue": date
                }
            },
            {
                "userEnteredValue": {
                    "stringValue": fromNumberToStringDay(day)
                }
            }
        ];
    }
}

export function formatTime(length: number) {
    let arr: any[] = [];
    for (let i = 0; i < length; ++i) {
        arr.push([{
            "values": {
                "userEnteredFormat": {
                    "numberFormat": {
                        "type": "TIME",
                        "pattern": "[h]\"時間\"mm\"分\"ss\"秒\""
                    }
                }
            }
        }]);
    }
    return arr;
}

export function formatMeters(length: number) {
    let arr: any[] = [];
    for (let i = 0; i < length; ++i) {
        arr.push([{
            "values": {
                "userEnteredFormat": {
                    "numberFormat": {
                        "type": "NUMBER",
                        "pattern": "0\\m"
                    }
                }
            }
        }]);
    }
    return arr;    
}

export function formatKilometers(length: number) {
    let arr: any[] = [];
    for (let i = 0; i < length; ++i) {
        arr.push([{
            "values": {
                "userEnteredFormat": {
                    "numberFormat": {
                        "type": "NUMBER",
                        "pattern": "0.00\\k\\m"
                    }
                }
            }
        }]);
    }
    return arr;    
}