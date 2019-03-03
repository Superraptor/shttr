#!/usr/bin/env python

#
#	Clair Kronk
#	2 March 2019
#	server.py
#

from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from json import dumps

app = Flask(__name__)
api = Api(app)

import database_management
import flask
import json

@app.route('/get_bathroom')
def get_bathroom():

    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    coords = {
        "latitude": float(latitude),
        "longitude": float(longitude),
        "radius": 0,
        "range": 0
    }

    query = database_management.search_bathroom_longlat(coords)
    
    resp = flask.Response(dumps(query))
    resp.headers['Access-Control-Allow-Origin'] = '*'

    return resp

@app.route('/search_bathrooms')
def search_bathrooms():
    
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    radius = request.args.get("radius")

    coords = {
        "latitude": float(latitude),
        "longitude": float(longitude), 
        "range": radius
    }

    query = database_management.search_bathroom_longlat(coords)

    resp = flask.Response(dumps(query))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    
    return resp

@app.route('/add_bathroom')
def add_bathroom():
    
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    rating = request.args.get("rating")
    building = request.args.get("building")
    floor = request.args.get("floor")
    organization = request.args.get("organization")
    bathroom_type = request.args.get("bathroom_type")
    open_status = request.args.get("open_status")
    accessible = request.args.get("accessible")
    changing_stations = request.args.get("changing_stations")
    startTimeSun = request.args.get("startTimeSun")
    endTimeSun = request.args.get("endTimeSun")
    startTimeMon = request.args.get("startTimeMon")
    endTimeMon = request.args.get("endTimeMon")
    startTimeTues = request.args.get("startTimeTues")
    endTimeTues = request.args.get("endTimeTues")
    startTimeWed = request.args.get("startTimeWed")
    endTimeWed = request.args.get("endTimeWed")
    startTimeThurs = request.args.get("startTimeThurs")
    endTimeThurs = request.args.get("endTimeThurs")
    startTimeFri = request.args.get("startTimeFri")
    endTimeFri = request.args.get("endTimeFri")
    startTimeSat = request.args.get("startTimeSat")
    endTimeSat = request.args.get("endTimeSat")

    new_bathroom = {
        "latitude": float(latitude),
        "longitude": float(longitude),
        "rating": rating,
        "building": building,
        "floor": floor,
        "organization": organization,
        "bathroom_type": bathroom_type,
        "open": open_status,
        "accessible": accessible,
        "changing_stations": changing_stations,
        "startTimeSun": startTimeSun,
        "endTimeSun": endTimeSun,
        "startTimeMon": startTimeMon,
        "endTimeMon": endTimeMon,
        "startTimeTues": startTimeTues,
        "endTimeTues": endTimeTues,
        "startTimeWed": startTimeWed,
        "endTimeWed": endTimeWed,
        "startTimeThurs": startTimeThurs,
        "endTimeThurs": endTimeThurs,
        "startTimeFri": startTimeFri,
        "endTimeFri": endTimeFri,
        "startTimeSat": startTimeSat,
        "endTimeSat": endTimeSat,
    }

    database_management.add_new_bathroom(new_bathroom)

    resp = flask.Response({'status': 'success'})
    resp.headers['Access-Control-Allow-Origin'] = '*'
    
    return resp

@app.route('/delete_bathroom')
def delete_bathroom():
    
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    bathroom_coords = {
        "latitude": float(latitude), 
        "longitude": float(longitude),
        "radius": 0,
        "range": 0
    }

    database_management.delete_bathroom(bathroom_coords)

    resp = flask.Response({'status': 'success'})
    resp.headers['Access-Control-Allow-Origin'] = '*'
    
    return resp

@app.route('/edit_bathroom')
def edit_bathroom():
    
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")
    rating = request.args.get("rating")
    building = request.args.get("building")
    floor = request.args.get("floor")
    organization = request.args.get("organization")
    bathroom_type = request.args.get("bathroom_type")
    open_status = request.args.get("open_status")
    accessible = request.args.get("accessible")
    changing_stations = request.args.get("changing_stations")
    startTimeSun = request.args.get("startTimeSun")
    endTimeSun = request.args.get("endTimeSun")
    startTimeMon = request.args.get("startTimeMon")
    endTimeMon = request.args.get("endTimeMon")
    startTimeTues = request.args.get("startTimeTues")
    endTimeTues = request.args.get("endTimeTues")
    startTimeWed = request.args.get("startTimeWed")
    endTimeWed = request.args.get("endTimeWed")
    startTimeThurs = request.args.get("startTimeThurs")
    endTimeThurs = request.args.get("endTimeThurs")
    startTimeFri = request.args.get("startTimeFri")
    endTimeFri = request.args.get("endTimeFri")
    startTimeSat = request.args.get("startTimeSat")
    endTimeSat = request.args.get("endTimeSat")

    bathroom_json = {
        "latitude": float(latitude),
        "longitude": float(longitude),
        "rating": rating,
        "building": building,
        "floor": floor,
        "organization": organization,
        "bathroom_type": bathroom_type,
        "open": open_status,
        "accessible": accessible,
        "changing_stations": changing_stations,
        "startTimeSun": startTimeSun,
        "endTimeSun": endTimeSun,
        "startTimeMon": startTimeMon,
        "endTimeMon": endTimeMon,
        "startTimeTues": startTimeTues,
        "endTimeTues": endTimeTues,
        "startTimeWed": startTimeWed,
        "endTimeWed": endTimeWed,
        "startTimeThurs": startTimeThurs,
        "endTimeThurs": endTimeThurs,
        "startTimeFri": startTimeFri,
        "endTimeFri": endTimeFri,
        "startTimeSat": startTimeSat,
        "endTimeSat": endTimeSat,
    }

    database_management.edit_bathroom(bathroom_json)

    resp = flask.Response({'status': 'success'})
    resp.headers['Access-Control-Allow-Origin'] = '*'
    
    return resp

#api.add_resource(Bathrooms, '/bathrooms')

if __name__ == '__main__':
     app.run()