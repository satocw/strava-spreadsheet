import * as request from "request-promise-native";

const cookieJar = request.jar();

export const auth = () => {
    return request.get('https://sso.garmin.com/sso/login', {
        qs: {
            'service': 'https://connect.garmin.com/post-auth/login',
            'clientId': 'GarminConnect',
            'gauthHost': 'https://sso.garmin.com/sso',
            'consumeServiceTicket': 'false'
        },
        jar: cookieJar
    }).then(response => {
        return request.post('https://sso.garmin.com/sso/login', {
            qs: {
                'service': 'https://connect.garmin.com/post-auth/login',
                'clientId': 'GarminConnect',
                'gauthHost': 'https://sso.garmin.com/sso',
                'consumeServiceTicket': 'false'
            },
            form: {
                'username': '',
                'password': '',
                'embed': 'true'
            },
            jar: cookieJar
        })
        .then(res => {
            return request.get('https://connect.garmin.com/post-auth/login', {
                jar: cookieJar
            }).then(res => {
                return cookieJar;        
            });
        });
    });
};

export const getActivities = () => {
    return request.get('https://connect.garmin.com/modern/proxy/activity-search-service-1.2/json/activities', {
        // qs: {
        //     limit: 2
        // },
        jar: cookieJar
    }).then(res => {
        const activities: any[] = JSON.parse(res)["results"]["activities"];
        console.log(activities[0].activity.activitySummary);
        const simpleActivities = activities.map(elem => {
            return {
                id: elem.activity.activityId, 
                activitySummary: {
                    BeginTimestamp: {
                        value: elem.activity.activitySummary.BeginTimestamp.value,
                        unit: elem.activity.activitySummary.BeginTimestamp.uom
                    },
                    SumDuration: {
                        value: elem.activity.activitySummary.SumDuration.value,
                        unit: elem.activity.activitySummary.SumDuration.uom
                    },
                    SumDistance: {
                        value: elem.activity.activitySummary.SumDistance.value,
                        unit: elem.activity.activitySummary.SumDistance.uom
                    },
                    GainElevation: {
                        value: elem.activity.activitySummary.GainElevation.value,
                        unit: elem.activity.activitySummary.GainElevation.uom
                    }
                }
            };
        });
        return simpleActivities;
    });
};

export const getActivity = (id) => {
    return request.get('https://connect.garmin.com/modern/proxy/download-service/export/tcx/activity/' + id, {
        jar: cookieJar
    }).then(res => {
        return res;
    });
};