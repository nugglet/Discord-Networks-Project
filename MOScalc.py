import os
import sys

def CalculateMOS(avg_latency, jitter, packet_loss):
    # Based on PingPlotter Pro approach (One Possible Approach to calculate MOS score)
    # The R value score is from 0 to 100, where a higher number is better, based on the source article the chosen R value is R = 93.2
    # The effective latency is calculated as average latency as well as the 'Jitter' which has double the impact to latency
    # A 10 is added in the end due to protocol-related latencies
    effectiveLatency = (avg_latency + jitter * 2 + 10)

    # Implement a basic curve where the R value within 160 ms latency will get deducted less aggresively than those above 160ms
    if effectiveLatency < 160:
        R_val = 93.2 - (effectiveLatency/40)
    else:
        R_val = 93.2 - (effectiveLatency - 120)/10
    # Every percentage of packet loss will deduct 2.5 R values
    R_val = R_val - (packet_loss * 2.5)
    # Apply known MOS score formula
    MOSscore = 1 + (0.035) * R_val + (0.000007) * R_val * (R_val - 60) * (100 - R_val)
    return MOSscore

# Data from ParsedData.txt
LongAudio = {'16K bitrate 8K Channel': {'PacketLoss': 0.15463917525773196, 'AverageLatency': 0.0636041263864535, 'Jitter': 0.002619685181282529}, 
    '16K bitrate 64K Channel': {'PacketLoss': 0.051539750032212346, 'AverageLatency': 0.008187350012122048, 'Jitter': 0.0026681652814226704},
	'128K bitrate 8K Channel':	{'PacketLoss': 0.12884937508053088, 'AverageLatency': 0.028128457364074044, 'Jitter': 0.00247935119751961},
	'128K bitrate 64K Channel': {'PacketLoss': 0.03865979381443299, 'AverageLatency': 0.004234555338989163, 'Jitter': 0.0025822583272814936}}

MediumAudio = {'16K bitrate 8K Channel': {'PacketLoss': 0.03132832080200501,	'AverageLatency': 0.030923416462858185, 'Jitter': 0.0021095938069693346},
	'16K bitrate 64K Channel': {'PacketLoss': 0.28177833437695676, 'AverageLatency': 0.010696463891811805, 'Jitter': 0.002688399211845206},
	'128K bitrate 8K Channel': {'PacketLoss': 0.06261740763932373, 'AverageLatency': 0.030424728650496082, 'Jitter': 0.002867846308140051},
	'128K bitrate 64K Channel': {'PacketLoss': 0.15654351909830932, 'AverageLatency': 0.004730265005212977, 'Jitter': 0.0024499165518221022}}

ShortAudio = {'16K bitrate 8K Channel': {'PacketLoss': 0.0, 'AverageLatency': 0.03127085794102077,	'Jitter': 0.0017963226944004485},
	'16K bitrate 64K Channel':	{'PacketLoss': 0.22727272727272727, 'AverageLatency': 0.01020805945428996, 'Jitter': 0.002418848477542128},
	'128K bitrate 8K Channel':	{'PacketLoss': 0.22675736961451248, 'AverageLatency': 0.02968117063695748, 'Jitter': 0.002664223890369737},
	'128K bitrate 64K Channel': {'PacketLoss': 0.22675736961451248, 'AverageLatency': 0.0053603270920839505, 'Jitter': 0.0022860138182759556}}

with open('MOS_Scores.txt', 'w', encoding='utf-8') as f:
    # Long Audio
    f.write("Long Audio MOS Scores\n")
    for data_entry in LongAudio:
        packetloss = LongAudio[data_entry]['PacketLoss']
        avg_latency = LongAudio[data_entry]['AverageLatency']
        jitter = LongAudio[data_entry]['Jitter']
        mos_score = CalculateMOS(packetloss,avg_latency,jitter)
        f.write(str(data_entry) + ": " + str(mos_score)+"\n")

    f.write("==============================================\n")

    # Medium Audio
    f.write("Medium Audio MOS Scores\n")
    for data_entry in MediumAudio:
        packetloss = MediumAudio[data_entry]['PacketLoss']
        avg_latency = MediumAudio[data_entry]['AverageLatency']
        jitter = MediumAudio[data_entry]['Jitter']
        mos_score = CalculateMOS(packetloss,avg_latency,jitter)
        f.write(str(data_entry) + ": " + str(mos_score)+"\n")

    f.write("==============================================\n")

    # Short Audio
    f.write("Short Audio MOS Scores\n")
    for data_entry in ShortAudio:
        packetloss = ShortAudio[data_entry]['PacketLoss']
        avg_latency = ShortAudio[data_entry]['AverageLatency']
        jitter = ShortAudio[data_entry]['Jitter']
        mos_score = CalculateMOS(packetloss,avg_latency,jitter)
        f.write(str(data_entry) + ": " + str(mos_score)+"\n")
    
    print("- Finished Calculating and Writing MOS Scores -")
    