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
            }
        }
    };
}

export function dateAndDays(year: number, month: number) {
    
}

export function dateAndDay(year: number, month: number, date: number) {
    return [
        {
            "userEnteredValue": {
                "numberValue": date
            }
        },
        {
            "userEnteredValue": {
                "stringValue": "月"
            }
        }
    ];
}