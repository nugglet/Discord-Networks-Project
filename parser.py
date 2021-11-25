import pandas as pd

def parsewireshark(filename):
    data = pd.read_csv(filename, header=0)
    filtereddata = data[(data.Length != 60)]
    seconddata = filtereddata.iloc[::2]
    timedata = seconddata.at_time
    # Do stuff with parsed data

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
parsewireshark(filename)
parseoggpackets(oggfilename)