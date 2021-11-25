import pandas as pd
import json


def parsewireshark(filename):
    data = pd.read_csv(filename, header=0)
    filtereddata = data[(data.Length != 60)]
    seconddata = filtereddata.iloc[::2]
    timedata = seconddata.at_time
    # Do stuff with parsed data

def parsejsonwiresharkrecv(filename):
    json_file = open(filename)
    json_string = json_file.read()
    data = json.loads(json_string)
    relevantdata = []
    for datum in data:
        if datum["_source"]["layers"]["frame"]["frame.len"] == '60':
            continue
        temp_dict = {"Number": datum["_source"]["layers"]["frame"]["frame.number"], "Time": datum["_source"]["layers"]["frame"]["frame.time_epoch"], "Length": datum["_source"]["layers"]["frame"]["frame.len"], "Port": datum["_source"]["layers"]["udp"]["udp.dstport"]}
        relevantdata.append(temp_dict)
    return relevantdata

def parsejsonwiresharksend(filename):
    json_file = open(filename)
    json_string = json_file.read()
    data = json.loads(json_string)
    relevantdata = []
    for datum in data:
        if datum["_source"]["layers"]["frame"]["frame.len"] == '50':
            continue
        temp_dict = {"Number": datum["_source"]["layers"]["frame"]["frame.number"], "Time": datum["_source"]["layers"]["frame"]["frame.time_epoch"], "Length": datum["_source"]["layers"]["frame"]["frame.len"], "Port": datum["_source"]["layers"]["udp"]["udp.dstport"]}
        relevantdata.append(temp_dict)
    return relevantdata

def parseoggpackets(filename):
    with open('./Data/very_long_audio_128k_chan64.txt', 'r', encoding='utf-8') as f:
        data = f.readlines()
    allpositions = data[7::9]
    relevantpositions = []
    for position in allpositions:
        if position != '\tGranule Position    : -1\n' and position != '\tGranule Position    : 0\n':
            relevantpositions.append([position])
    for position in relevantpositions:
        index = data.index(position[0])
        position.append(data[index + 1])
    # Do stuff with parsed data


filename = './Data/verylongaudio-16k-channel64k.csv'
oggfilename = './Data/very_long_audio_128k_chan64.txt'
#parsewireshark(filename)
#parseoggpackets(oggfilename)
type = '-shortaudio-128-channel64.json'
recv_data = parsejsonwiresharkrecv('./newer_data/recv' + type)
sender_data = parsejsonwiresharksend('./newer_data/sender' + type)

# Need to manually find the ports
port = "55441"

bot_recv = []
with open('recv_data.txt', 'w', encoding='utf-8') as f:
    f.write(str(bot_recv))
with open('send_data.txt', 'w', encoding='utf-8') as f:
    f.write(str(sender_data))
for datum in recv_data:
    if datum["Port"] == port:
        bot_recv.append(datum)
print(len(bot_recv))
print(len(sender_data))

packet_loss = (len(sender_data) - len(bot_recv)) / len(sender_data) * 100
print(f'Packet Loss: {packet_loss}%')

send_count = 0
recv_count = 0
false_set = set()
for i in range(len(sender_data) - 1):
    if sender_data[send_count]['Length'] != bot_recv[recv_count]['Length']:
        false_set.add(send_count)
    else:
        recv_count+=1
    send_count += 1
for index in false_set:
    del sender_data[index]
print(len(bot_recv))
print(len(sender_data))

latency_array = []
for send, recv in zip(sender_data, bot_recv):
    latency_array.append(float(recv["Time"]) - float(send["Time"])+ 0.72)

total_latency = 0
total_jitter = 0
count = 0
for latency in latency_array:
    total_latency += latency
    count += 1
    if count <= len(latency_array) - 1:
        total_jitter += abs(latency - latency_array[count])
avg_latency = total_latency / len(bot_recv)
print(f'Average Latency: {avg_latency}s')
jitter = total_jitter / (len(latency_array) - 1)
print(f'Jitter: {jitter}s')
