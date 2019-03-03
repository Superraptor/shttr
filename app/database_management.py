import json

longitude = 'longitude'
latitude = 'latitude'
cleanliness = 'cleanliness'
attr = 'attribute'
room_range = 'range'
changing_station = 'changing_station'
bathroom_type = 'bathroom_type'
room_handicap = 'handicap_accessible'
bathroom_open = 'open'
organization = 'organization'

bathroom_database_name = 'bathroom_database.json'


# loads the database json, goes through each listing for matching criteria
def search_bathroom_longlat(coords):
    if type(coords) == "str":
        long_lat = json.load(coords)
    else:
        long_lat = coords
    valid_bathrooms = []

    with open(bathroom_database_name, mode='r', encoding='UTF8') as json_file:
        all_bathrooms = json.load(json_file)
        for bathroom in all_bathrooms:
            if within_range(long_lat, bathroom):
                valid_bathrooms.append(bathroom)
                
    return valid_bathrooms


# Checks if the bathroom is within the range of the user
def within_range(location, found_bathroom):
    distance = abs(
        (float(location[longitude]) - float(found_bathroom[longitude])) + (float(location[latitude]) - float(found_bathroom[latitude])))

    if distance <= float(location[room_range]):
        return True
    else:
        return False


# Loops through each database member checking for a rating above the specified cleanliness
def search_bathroom_cleanliness(clean_search):
    if type(clean_search) == "str":
        clean_rating = json.load(clean_search)
    else:
        clean_rating = clean_search
    valid_bathrooms = []

    with open(bathroom_database_name) as json_file:
        all_bathrooms = json.load(json_file)

        for bathroom in all_bathrooms:
            if is_clean(clean_rating, bathroom):
                valid_bathrooms.append(bathroom)

    return valid_bathrooms


# Returns whether bathroom meets cleanliness rating
def is_clean(clean_rating, current_bathroom):
    if current_bathroom[cleanliness] >= clean_rating[cleanliness]:
        return True
    else:
        return False


# Takes JSON file and checks for attribute listing and any specifiers
def attribute_search(attribute_string):
    attribute = json.load(attribute_string)
    valid_bathrooms = []

    with open(bathroom_database_name) as json_file:
        all_bathrooms = json.load(json_file)

        # Checks against each attribute in the database members
        for bathroom in all_bathrooms:
            if attribute[attr] == changing_station and bathroom[attr][changing_station]:
                valid_bathrooms.append(bathroom)
            elif attribute[attr] == bathroom_type:
                if bathroom[attr][bathroom_type] == 'men':
                    valid_bathrooms.append(bathroom)
                elif bathroom[attr][bathroom_type] == 'women':
                    valid_bathrooms.append(bathroom)
                elif bathroom[attr][bathroom_type] == 'family':
                    valid_bathrooms.append(bathroom)
                elif bathroom[attr][bathroom_type] == 'all':
                    valid_bathrooms.append(bathroom)
            elif attribute[attr] == room_handicap and bathroom[attr][room_handicap]:
                valid_bathrooms.append(bathroom)
            elif attribute[attr] == bathroom_open and bathroom[attr][bathroom_open]:
                valid_bathrooms.append(bathroom)
            elif attribute[attr] == organization:
                if attribute[attr][organization] == bathroom[attr][organization]:
                    valid_bathrooms.append(bathroom)
            else:
                print("something went wrong in attribute_search")
    return valid_bathrooms


# Adds a new bathroom to the JSON database
def add_new_bathroom(new_bathroom):
    with open(bathroom_database_name, "r") as database:
        temp_dict = json.load(database)
        temp_dict.append(new_bathroom)

    with open(bathroom_database_name, "w") as database:
        json.dump(temp_dict, database)


# Deletes a specified bathroom from the database
def delete_bathroom(bathroom_coords):
    valid_bathroom = delete_search(bathroom_coords)

    with open(bathroom_database_name, mode='r') as database:
        temp_database = json.load(database)
        temp_database.pop(valid_bathroom)
    with open(bathroom_database_name, mode='w') as database:
        json.dump(temp_database, database)


def delete_search(coords):
    if type(coords) == "str":
        long_lat = json.load(coords)
    else:
        long_lat = coords
    count = 0

    with open(bathroom_database_name, mode='r', encoding='UTF8') as json_file:
        all_bathrooms = json.load(json_file)

        for bathroom in all_bathrooms:
            if within_range(long_lat, bathroom):
                break;
            count += 1
    return count


def edit_bathroom(bathroom_json):
    if type(bathroom_json) == "str":
        new_values = json.load(bathroom_json)
    else:
        new_values = bathroom_json
        
    found = False
    count = 0

    with open(bathroom_database_name, mode='r') as database:
        all_bathrooms = json.load(database)

        for bathroom in all_bathrooms:
            if bathroom[longitude] == float(new_values[longitude]) and bathroom[latitude] == float(new_values[latitude]):
                found = True
                all_bathrooms[count] = new_values
                break;
            count += 1
            
    with open(bathroom_database_name, mode='w') as database:
        if found:
            json.dump(all_bathrooms, database)


# useless comment
def main():
    
    print(search_bathroom_longlat({
        "latitude": "39",
        "longitude": "-84",
        "range": "20"
    }))
    
    exit()
    
    test_location = {
        'latitude': 0,
        'longitude': 0,
        'range': 20
    }
    with open('edit_test.json', mode='r') as json_file:
        edit_bathroom(json_file)

    # with open('delete_test.json', mode='r') as delete:
        # delete_bathroom(delete)

    with open('test_coords.json', mode="w") as json_file:
        json.dump(test_location, json_file)

    with open('test_coords.json', mode="r") as json_file:
        results = search_bathroom_longlat(json_file)




# MAIN
if __name__ == '__main__': main()
