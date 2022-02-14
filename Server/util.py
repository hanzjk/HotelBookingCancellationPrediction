import json
import  pickle
import numpy as np
from sqlalchemy import null
import pandas as pd
import csv

__months, __monthList=None, []
__reserved_room_types, __reserved_room_typeList=None, []
__customer_types, __customer_typList=None, []
__market_segments, __market_segmentList=None, []
__deposit_types, __deposit_typeList=None, []
__distribution_channels, __distribution_channelList=None, []

__data_columns = None
__model = None

def get_arrival_month():
    return __monthList

def get_reserved_room_types():
    return __reserved_room_typeList

def get_customer_type():
    return __customer_typList

def get_market_segment():
    return __market_segmentList

def get_deposit_type():
    return __deposit_typeList

def get_distribution_channel():
    return __distribution_channelList




def return_predict_cancellation(reserved_room_type,guests, distribution_channel, arrival_date_month,arrival_date_day_of_month,total_stays,booking_changes,required_car_parking_spaces,customer_type,adr,previous_cancellations,market_segment,total_of_special_requests,lead_time,deposit_type):    
    try:
        reserved_room_type_index = __data_columns.index('reserved_room_type_'+reserved_room_type.lower())
    except:
        reserved_room_type_index = -1
    
    try:
        customer_type_index = __data_columns.index('customer_type_'+customer_type.lower())
    except:
        customer_type_index = -1

    try:
        market_segment_index = __data_columns.index('market_segment_'+market_segment.lower())
    except:
        market_segment_index = -1

    try:
        deposit_type_index = __data_columns.index('deposit_type_'+deposit_type.lower())
    except:
        deposit_type_index = -1

    try:
        arrival_date_month_index = __data_columns.index('arrival_date_month_'+arrival_date_month.lower())
    except:
        arrival_date_month_index = -1

    try:
        distribution_channel_index = __data_columns.index('distribution_channel_'+distribution_channel.lower())
    except:
        distribution_channel_index = -1
    
    


    x = np.zeros(len(__data_columns))
    x[8] = guests
    x[1] = arrival_date_day_of_month
    x[7] = total_stays
    x[3] = booking_changes
    x[5] = required_car_parking_spaces
    x[2] = previous_cancellations
    x[6] = total_of_special_requests
    x[4] = adr
    x[0] = lead_time

  

    if reserved_room_type_index >= 0:
        x[reserved_room_type_index] = 1

    if customer_type_index >= 0:
        x[customer_type_index] = 1

    if market_segment_index >= 0:
        x[market_segment_index] = 1

    if deposit_type_index >= 0:
        x[deposit_type_index] = 1
    
    if arrival_date_month_index >= 0:
        x[arrival_date_month_index] = 1
    
    if distribution_channel_index >= 0:
        x[distribution_channel_index] = 1
   
   
    return [__model.predict([x])[0],__model.predict_proba([x])]


def load_saved_artifacts():
    print("loading saved artifacts...start")
    global  __data_columns
    global __months, __monthList
    global __reserved_room_types, __reserved_room_typeList
    global __customer_types, __customer_typList
    global __market_segments, __market_segmentList
    global __deposit_types, __deposit_typeList
    global __distribution_channels, __distribution_channelList

    with open("artifacts/columns.json", "r") as f:
        __data_columns = json.load(f)['data_columns']

        __months = __data_columns[9:21]
        for month in __months:
                parts = month.split('_')
                __monthList.append(parts[3])

        __reserved_room_types = __data_columns[34:43]
        for reserved_room_type in __reserved_room_types:
                parts = reserved_room_type.split('_')
                __reserved_room_typeList.append(parts[3].upper())
        
        __customer_types = __data_columns[46:50]
        for customer_type in __customer_types:
                parts = customer_type.split('_')
                __customer_typList.append(parts[2].title())

        __deposit_types = __data_columns[43:46]
        for deposit_type in __deposit_types:
                parts = deposit_type.split('_')
                __deposit_typeList.append(parts[2].title())

        __market_segments = __data_columns[21:29]
        for market_segment in __market_segments:
                parts = market_segment.split('_')
                __market_segmentList.append(parts[2].title())

        __distribution_channels = __data_columns[29:34]
        for distribution_channel in __distribution_channels:
                parts = distribution_channel.split('_')
                __distribution_channelList.append(parts[2].title())


    global __model
    if __model is None:
        with open('artifacts/hotel_booking_cancellation_final.pickle', 'rb') as f:
            __model = pickle.load(f)
        print("loading saved artifacts...done")

def batchPrediction(df):
    df = df.reset_index()
    data = []
    for index,row in df.iterrows():
        prediction=return_predict_cancellation(row['reserved_room_type'],row['guests'],row['distribution_channel'],row['arrival_date_month'],row['arrival_date_day_of_month'],row['total_stays'],row['booking_changes'],row['required_car_parking_spaces'],row['customer_type'],row['adr'],row['previous_cancellations'],row['market_segment'],row['total_of_special_requests'],row['lead_time'],row['deposit_type'])
        pred=prediction[0]
        if(pred==0):
            pred="Confirmed"
        else:
            pred="Cancelled"
        target_0=round(float(prediction[1][0][0]),2)
        target_1=round(float(prediction[1][0][1]),2)
        data.append([pred, target_0, target_1])
    df_result = pd.DataFrame( data,columns = ['Prediction','Confirmation Probability', 'Cancellation Probability'])
    jsonfiles = json.loads(df_result.to_json(orient='records'))

    return(jsonfiles)

    # data = []
    # csv_dicts = [{k: v for k, v in row.items()} for row in csv.DictReader(fstring.splitlines(), skipinitialspace=True)]
    # for row in csv_dicts:
    #     prediction=return_predict_cancellation(row['reserved_room_type'],row['guests'],row['distribution_channel'],row['arrival_date_month'],row['arrival_date_day_of_month'],row['total_stays'],row['booking_changes'],row['required_car_parking_spaces'],row['customer_type'],row['adr'],row['previous_cancellations'],row['market_segment'],row['total_of_special_requests'],row['lead_time'],row['deposit_type'])
    #     pred=prediction[0]
    #     target_0=round(float(prediction[1][0][0]),2)
    #     target_1=round(float(prediction[1][0][1]),2)
    #     data.append([pred, target_0, target_1])
    # df_result = pd.DataFrame( data,columns = ['Prediction','Confirmation Probability', 'Cancellation Probability'])            
    # return (df_result.to_json(orient="records"))  

    # data = []
    # with open(csvFile,mode='r', encoding='utf-8-sig') as csv_file:
    #     fstring = csv_file.read()
    #     csv_dicts = [{k: v for k, v in row.items()} for row in csv.DictReader(fstring.splitlines(), skipinitialspace=True)]
    #     for row in csv_dicts:
    #             prediction=return_predict_cancellation(row['reserved_room_type'],row['guests'],row['distribution_channel'],row['arrival_date_month'],row['arrival_date_day_of_month'],row['total_stays'],row['booking_changes'],row['required_car_parking_spaces'],row['customer_type'],row['adr'],row['previous_cancellations'],row['market_segment'],row['total_of_special_requests'],row['lead_time'],row['deposit_type'])
    #             pred=prediction[0]
    #             target_0=round(float(prediction[1][0][0]),2)
    #             target_1=round(float(prediction[1][0][1]),2)
    #             data.append([pred, target_0, target_1])
    # df_result = pd.DataFrame( data,columns = ['Prediction','Confirmation Probability', 'Cancellation Probability'])              
    
    # return(df_result.to_json(orient="records"))


    # df = pd.read_csv(csv)
    # data = []

    # for row in df.iterrows():
    #     prediction=return_predict_cancellation(row['reserved_room_type'],row['guests'],row['distribution_channel'],row['arrival_date_month'],row['arrival_date_day_of_month'],row['total_stays'],row['booking_changes'],row['required_car_parking_spaces'],row['customer_type'],row['adr'],row['previous_cancellations'],row['market_segment'],row['total_of_special_requests'],row['lead_time'],row['deposit_type'])
    #     pred=prediction[0]
    #     target_0=round(float(prediction[1][0][0]),2)
    #     target_1=round(float(prediction[1][0][1]),2)
    #     data.append([pred, target_0, target_1])
    # df_result = pd.DataFrame( data,columns = ['Prediction','Confirmation Probability', 'Cancellation Probability'])
    # return df_result
    # df_result.to_csv("./file.csv", sep=',',index=False)




if __name__ == '__main__':
    load_saved_artifacts()
    batchPrediction('../modal/testData.csv')
    # print(get_arrival_month())
    # print(get_reserved_room_types())
    # print(get_customer_type())
    # print(get_market_segment())
    # print(get_deposit_type())
    # print(get_distribution_channel())

    # print(((return_predict_cancellation('C',3,'Direct','July',1,2,0,0,'Transient',0,0,'Direct',1,23,'No Deposit')[1])[0])[1])
    