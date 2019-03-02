import json

json_file_name = "./sample.json"

def main():
	temp_dict = {
		"name": "temp",
		"id": "fake"
	}
	
	with open(json_file_name, "w", encoding="UTF-8") as f:
		json.dump([], f)

	add_to_json(json_file_name, temp_dict)
	add_to_json(json_file_name, temp_dict)

def add_to_json(json_file_name, dict):
	d = {}

	with open(json_file_name, "r") as json_data:
		d = json.load(json_data)
		d.append(dict)
		
	with open(json_file_name, "w") as json_data:
		json.dump(d, json_data)

#	MAIN
if __name__ == "__main__": main()