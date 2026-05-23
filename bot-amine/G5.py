import requests, os, psutil, sys, jwt, pickle, json, binascii, time, urllib3, base64, datetime, re, socket, threading, ssl, pytz, aiohttp, asyncio, random, httpx
from protobuf_decoder.protobuf_decoder import Parser
from xWar import *
from datetime import datetime
from google.protobuf.timestamp_pb2 import Timestamp
from concurrent.futures import ThreadPoolExecutor
from threading import Thread
from Pb2 import DEcwHisPErMsG_pb2, MajoRLoGinrEs_pb2, PorTs_pb2, MajoRLoGinrEq_pb2, sQ_pb2, Team_msg_pb2
from cfonts import render, say

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

ADMIN_UID = "4038829094"
online_writer = None
whisper_writer = None
spam_room = False
spammer_uid = None
spam_chat_id = None
spam_uid = None
Spy = False
lag_task = None
Chat_Leave = False
is_muted = False
mute_until = 0
spam_requests_sent = 0
bot_start_time = time.time()
danger_spam_active = False
evo_cycle_active = False
current_evo_index = 0
evo_emotes = [
    909000063, 909000068, 909000075, 909000081, 909000085, 909000090, 909000098, 909033001, 909035007, 909037011,
    909038010, 909038012, 909039011, 909040010, 909041005, 909042008, 909045001, 909051003
]

connection_pool = None
command_cache = {}
last_request_time = {}
RATE_LIMIT_DELAY = 0.1
MAX_CACHE_SIZE = 50
CLEANUP_INTERVAL = 300

command_stats = {}

spam_active = False
current_spam_uid = None
spam_task = None

status_requester = None
status_timeout_task = None
ghost_event = asyncio.Event()
ghost_data = None

def cleanup_cache():
    current_time = time.time()
    to_remove = [k for k, v in last_request_time.items()
                 if current_time - v > CLEANUP_INTERVAL]
    for k in to_remove:
        last_request_time.pop(k, None)

    if len(command_cache) > MAX_CACHE_SIZE:
        oldest_keys = sorted(command_cache.keys())[:len(command_cache)//2]
        for key in oldest_keys:
            command_cache.pop(key, None)

def get_rate_limited_response(user_id):
    user_key = str(user_id)
    current_time = time.time()

    if user_key in last_request_time:
        time_since_last = current_time - last_request_time[user_key]
        if time_since_last < RATE_LIMIT_DELAY:
            return False

    last_request_time[user_key] = current_time
    return True

async def spam_worker(uid, duration_minutes, stop_event):
    global current_spam_uid
    current_spam_uid = uid
    base_url = "http://cloud-serv.mooo.com:3046/spam"
    params = {"user_id": uid}
    if duration_minutes:
        params["duration"] = duration_minutes

    async with httpx.AsyncClient(timeout=5) as client:
        while not stop_event.is_set():
            try:
                resp = await client.get(base_url, params=params)
                print(f"[SPAM] Sent to {uid}, duration={duration_minutes}, status={resp.status_code}")
            except Exception as e:
                print(f"[SPAM] Error: {e}")
            await asyncio.sleep(0.5)


        
login_url, ob, version = AuToUpDaTE()

Hr = {
    'User-Agent': Uaa(),
    'Connection': "Keep-Alive",
    'Accept-Encoding': "gzip",
    'Content-Type': "application/x-www-form-urlencoded",
    'Expect': "100-continue",
    'X-Unity-Version': "2018.4.11f1",
    'X-GA': "v1 1",
    'ReleaseVersion': ob
}

def get_random_color():
    colors = [
        "[FF0000]", "[00FF00]", "[0000FF]", "[FFFF00]", "[FF00FF]", "[00FFFF]", "[FFFFFF]", "[FFA500]",
        "[DC143C]", "[00CED1]", "[9400D3]", "[F08080]", "[20B2AA]", "[FF1493]", "[7CFC00]", "[B22222]",
        "[FF4500]", "[DAA520]", "[00BFFF]", "[00FF7F]", "[4682B4]", "[6495ED]", "[DDA0DD]", "[E6E6FA]",
        "[2E8B57]", "[3CB371]", "[6B8E23]", "[808000]", "[B8860B]", "[CD5C5C]", "[8B0000]", "[FF6347]"
    ]
    return random.choice(colors)

def is_admin(uid):
    return str(uid) == ADMIN_UID

def is_bot_muted():
    global is_muted, mute_until
    if is_muted and time.time() < mute_until:
        return True
    elif is_muted and time.time() >= mute_until:
        is_muted = False
        mute_until = 0
        return False
    return False

def update_command_stats(command):
    if command not in command_stats:
        command_stats[command] = 0
    command_stats[command] += 1
    

            

async def safe_send_message(chat_type, message, target_uid, chat_id, key, iv, max_retries=3):
    for attempt in range(max_retries):
        try:
            P = await SEndMsG(chat_type, message, target_uid, chat_id, key, iv)
            await SEndPacKeT(whisper_writer, online_writer, 'ChaT', P)
            print(f"Message sent successfully on attempt {attempt + 1}")
            return True
        except Exception as e:
            print(f"Failed to send message (attempt {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(0.5)
    return False

async def encrypted_proto(encoded_hex):
    key = b'Yg&tc%DEuh6%Zc^8'
    iv = b'6oyZDr22E3ychjM%'
    cipher = AES.new(key, AES.MODE_CBC, iv)
    padded_message = pad(encoded_hex, AES.block_size)
    encrypted_payload = cipher.encrypt(padded_message)
    return encrypted_payload

async def GeNeRaTeAccEss(uid, password):
    url = "https://100067.connect.garena.com/oauth/guest/token/grant"
    headers = {
        "Host": "100067.connect.garena.com",
        "User-Agent": (await Ua()),
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "close"
    }
    data = {
        "uid": uid,
        "password": password,
        "response_type": "token",
        "client_type": "2",
        "client_secret": "2ee44819e9b4598845141067b281621874d0d5d7af9d8f7e00c1e54715b7d1e3",
        "client_id": "100067"
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=Hr, data=data) as response:
            if response.status != 200: return await response.read()
            data = await response.json()
            open_id = data.get("open_id")
            access_token = data.get("access_token")
            return (open_id, access_token) if open_id and access_token else (None, None)

async def EncRypTMajoRLoGin(open_id, access_token):
    major_login = MajoRLoGinrEq_pb2.MajorLogin()
    major_login.event_time = str(datetime.now())[:-7]
    major_login.game_name = "free fire"
    major_login.platform_id = 1
    major_login.client_version = version
    major_login.system_software = "Android OS 9 / API-28 (PQ3B.190801.10101846/G9650ZHU2ARC6)"
    major_login.system_hardware = "Handheld"
    major_login.telecom_operator = "Verizon"
    major_login.network_type = "WIFI"
    major_login.screen_width = 1920
    major_login.screen_height = 1080
    major_login.screen_dpi = "280"
    major_login.processor_details = "ARM64 FP ASIMD AES VMH | 2865 | 4"
    major_login.memory = 3003
    major_login.gpu_renderer = "Adreno (TM) 640"
    major_login.gpu_version = "OpenGL ES 3.1 v1.46"
    major_login.unique_device_id = "Google|34a7dcdf-a7d5-4cb6-8d7e-3b0e448a0c57"
    major_login.client_ip = "223.191.51.89"
    major_login.language = "en"
    major_login.open_id = open_id
    major_login.open_id_type = "4"
    major_login.device_type = "Handheld"
    memory_available = major_login.memory_available
    memory_available.version = 55
    memory_available.hidden_value = 81
    major_login.access_token = access_token
    major_login.platform_sdk_id = 1
    major_login.network_operator_a = "Verizon"
    major_login.network_type_a = "WIFI"
    major_login.client_using_version = "7428b253defc164018c604a1ebbfebdf"
    major_login.external_storage_total = 36235
    major_login.external_storage_available = 31335
    major_login.internal_storage_total = 2519
    major_login.internal_storage_available = 703
    major_login.game_disk_storage_available = 25010
    major_login.game_disk_storage_total = 26628
    major_login.external_sdcard_avail_storage = 32992
    major_login.external_sdcard_total_storage = 36235
    major_login.login_by = 3
    major_login.library_path = "/data/app/com.dts.freefireth-YPKM8jHEwAJlhpmhDhv5MQ==/lib/arm64"
    major_login.reg_avatar = 1
    major_login.library_token = "5b892aaabd688e571f688053118a162b|/data/app/com.dts.freefireth-YPKM8jHEwAJlhpmhDhv5MQ==/base.apk"
    major_login.channel_type = 3
    major_login.cpu_type = 2
    major_login.cpu_architecture = "64"
    major_login.client_version_code = "2019118695"
    major_login.graphics_api = "OpenGLES2"
    major_login.supported_astc_bitset = 16383
    major_login.login_open_id_type = 4
    major_login.analytics_detail = b"FwQVTgUPX1UaUllDDwcWCRBpWAUOUgsvA1snWlBaO1kFYg=="
    major_login.loading_time = 13564
    major_login.release_channel = "android"
    major_login.extra_info = "KqsHTymw5/5GB23YGniUYN2/q47GATrq7eFeRatf0NkwLKEMQ0PK5BKEk72dPflAxUlEBir6Vtey83XqF593qsl8hwY="
    major_login.android_engine_init_flag = 110009
    major_login.if_push = 1
    major_login.is_vpn = 1
    major_login.origin_platform_type = "4"
    major_login.primary_platform_type = "4"
    string = major_login.SerializeToString()
    return await encrypted_proto(string)

async def MajorLogin(payload):
    url = f"{login_url}MajorLogin"
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    async with aiohttp.ClientSession() as session:
        async with session.post(url, data=payload, headers=Hr, ssl=ssl_context) as response:
            if response.status == 200: return await response.read()
            return None

async def GetLoginData(base_url, payload, token):
    url = f"{base_url}/GetLoginData"
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    Hr['Authorization'] = f"Bearer {token}"
    try:
        async with connection_pool.post(url, data=payload, headers=Hr, ssl=ssl_context) as response:
            if response.status == 200:
                return await response.read()
            return None
    except:
        return None

async def DecRypTMajoRLoGin(MajoRLoGinResPonsE):
    proto = MajoRLoGinrEs_pb2.MajorLoginRes()
    proto.ParseFromString(MajoRLoGinResPonsE)
    return proto

async def DecRypTLoGinDaTa(LoGinDaTa):
    proto = PorTs_pb2.GetLoginData()
    proto.ParseFromString(LoGinDaTa)
    return proto

async def DecodeWhisperMessage(hex_packet):
    packet = bytes.fromhex(hex_packet)
    proto = DEcwHisPErMsG_pb2.DecodeWhisper()
    proto.ParseFromString(packet)
    return proto

async def decode_team_packet(hex_packet):
    packet = bytes.fromhex(hex_packet)
    proto = sQ_pb2.recieved_chat()
    proto.ParseFromString(packet)
    return proto

async def xAuThSTarTuP(TarGeT, token, timestamp, key, iv):
    uid_hex = hex(TarGeT)[2:]
    uid_length = len(uid_hex)
    encrypted_timestamp = await DecodE_HeX(timestamp)
    encrypted_account_token = token.encode().hex()
    encrypted_packet = await EnC_PacKeT(encrypted_account_token, key, iv)
    encrypted_packet_length = hex(len(encrypted_packet) // 2)[2:]
    if uid_length == 9:
        headers = '0000000'
    elif uid_length == 8:
        headers = '00000000'
    elif uid_length == 10:
        headers = '000000'
    elif uid_length == 7:
        headers = '000000000'
    else:
        print('Unexpected length')
        headers = '0000000'
    return f"0115{headers}{uid_hex}{encrypted_timestamp}00000{encrypted_packet_length}{encrypted_packet}"

async def cHTypE(H):
    if not H:
        return 'Squid'
    elif H == 1:
        return 'CLan'
    elif H == 2:
        return 'PrivaTe'

async def SEndMsG(H, message, Uid, chat_id, key, iv):
    TypE = await cHTypE(H)
    if TypE == 'Squid':
        msg_packet = await xSEndMsgsQ(message, chat_id, key, iv)
    elif TypE == 'CLan':
        msg_packet = await xSEndMsg(message, 1, chat_id, chat_id, key, iv)
    elif TypE == 'PrivaTe':
        msg_packet = await xSEndMsg(message, 2, Uid, Uid, key, iv)
    return msg_packet

async def SEndPacKeT(OnLinE, ChaT, TypE, PacKeT):
    if TypE == 'ChaT' and ChaT:
        whisper_writer.write(PacKeT)
        await whisper_writer.drain()
    elif TypE == 'OnLine':
        online_writer.write(PacKeT)
        await online_writer.drain()
    else:
        return 'UnsoPorTed TypE ! >> ErrrroR (:():)'

async def danger_spam_command(uids, emote_id, key, iv, region):
    global danger_spam_active
    danger_spam_active = True
    count = 0
    while danger_spam_active and count < 20:
        for uid in uids:
            if not danger_spam_active:
                break
            try:
                H = await Emote_k(uid, emote_id, key, iv, region)
                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', H)
            except:
                pass
            await asyncio.sleep(0.1)
        count += 1
        await asyncio.sleep(0.5)
    danger_spam_active = False

async def evo_cycle_command(uids, key, iv, region):
    global evo_cycle_active, current_evo_index, evo_emotes
    evo_cycle_active = True
    while evo_cycle_active:
        emote_id = evo_emotes[current_evo_index]
        for uid in uids:
            if not evo_cycle_active:
                break
            try:
                H = await Emote_k(uid, emote_id, key, iv, region)
                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', H)
            except:
                pass
            await asyncio.sleep(0.1)
        current_evo_index = (current_evo_index + 1) % len(evo_emotes)
        await asyncio.sleep(8)

async def stop_commands():
    global evo_cycle_active, danger_spam_active, spam_active, spam_task
    evo_cycle_active = False
    danger_spam_active = False
    if spam_active:
        spam_active = False
        if spam_task:
            spam_task.cancel()

async def status_timeout(requester_uid, requester_chat_id, requester_chat_type, key, iv):
    await asyncio.sleep(8)
    global status_requester, status_timeout_task
    if status_requester:
        print("[DEBUG] Status request timed out. Sending timeout message.")
        msg = "[FFA500]Status request timed out. Player may be offline or unreachable."
        await safe_send_message(requester_chat_type, msg, requester_uid, requester_chat_id, key, iv)
        status_requester = None
    status_timeout_task = None

    

async def TcPOnLine(ip, port, key, iv, AutHToKen, reconnect_delay=0.5):
    global online_writer, spam_room, whisper_writer, spammer_uid, spam_chat_id, spam_uid, XX, uid, Spy, data2, Chat_Leave, lag_running, lag_task, status_requester, status_timeout_task, ghost_event, ghost_data

    while True:
        try:
            reader, writer = await asyncio.open_connection(ip, int(port))
            online_writer = writer
            bytes_payload = bytes.fromhex(AutHToKen)
            online_writer.write(bytes_payload)
            await online_writer.drain()
            while True:
                data2 = await reader.read(9999)
                if not data2:
                    break

  
                if data2.hex().startswith('0500') and len(data2.hex()) > 1000:
                    try:
                        packet = await DeCode_PackEt(data2.hex()[10:])
                        packet = json.loads(packet)
                        OwNer_UiD, CHaT_CoDe, SQuAD_CoDe = await GeTSQDaTa(packet)

                        ghost_data = (OwNer_UiD, SQuAD_CoDe)
                        ghost_event.set()

                        try:
                            creator_uid = packet.get('5', {}).get('data', {}).get('2', {}).get('data', {}).get('1', {}).get('data')
                            if creator_uid:
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', await _7mInV(creator_uid, key, iv))
                                await asyncio.sleep(0.2)

                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', await Exit(None, key, iv))
                                await asyncio.sleep(0.2)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', await Send_GhosTs(OwNer_UiD, f'[b][c]InsTa => [b][c]{get_random_color()}@war_officiel', SQuAD_CoDe, key, iv))
                        except:
                            pass

                        JoinCHaT = await AutH_Chat(3, OwNer_UiD, CHaT_CoDe, key, iv)
                        await SEndPacKeT(whisper_writer, online_writer, 'ChaT', JoinCHaT)

                        message = f"""
[b]Welcome

{get_random_color()} تم اخَََََتَََََراق الاسكواد بواسطة PSX BOT 

{get_random_color()} PSX BOT

- {get_random_color()}To see commands type: [ff0000]/help[ffffff]

- {get_random_color()}By AMiNE

تابعني او سيتم تبنيد حسابك

[808080]- Follow me on Instagram => [00ff00] @mohamed_amin_dahbi

[808080]- Telegram => [00ff00] @WC_2C
"""
                        P = await SEndMsG(0, message, OwNer_UiD, OwNer_UiD, key, iv)
                        await SEndPacKeT(whisper_writer, online_writer, 'ChaT', P)

                    except:
                        if data2.hex().startswith('0500') and len(data2.hex()) > 1000:
                            try:
                                packet = await DeCode_PackEt(data2.hex()[10:])
                                packet = json.loads(packet)
                                OwNer_UiD, CHaT_CoDe, SQuAD_CoDe = await GeTSQDaTa(packet)

                                JoinCHaT = await AutH_Chat(3, OwNer_UiD, CHaT_CoDe, key, iv)
                                await SEndPacKeT(whisper_writer, online_writer, 'ChaT', JoinCHaT)

                                message = f"[B][C]{get_random_color()}\n- WeLComE To AMiNE ! \n\n{get_random_color()}- Commands : @a {xMsGFixinG('123456ء78')} {xMsGFixinG('909000001')}\n\n[00FF00]Dev : @xAMiNE.py"
                                P = await SEndMsG(0, message, OwNer_UiD, OwNer_UiD, key, iv)
                                await SEndPacKeT(whisper_writer, online_writer, 'ChaT', P)
                            except:
                                pass

            online_writer.close()
            await online_writer.wait_closed()
            online_writer = None

        except Exception as e:
            print(f"- ErroR With {ip}:{port} - {e}")
            online_writer = None
        await asyncio.sleep(reconnect_delay)

async def TcPChaT(ip, port, AutHToKen, key, iv, LoGinDaTaUncRypTinG, ready_event, region, reconnect_delay=0.5):
    print(region, 'TCP CHAT')

    global spam_room, whisper_writer, spammer_uid, spam_chat_id, spam_uid, online_writer, chat_id, XX, uid, Spy, data2, Chat_Leave, is_muted, mute_until, lag_running, lag_task, spam_active, spam_task, current_spam_uid, status_requester, status_timeout_task
    while True:
        try:
            reader, writer = await asyncio.open_connection(ip, int(port))
            whisper_writer = writer
            bytes_payload = bytes.fromhex(AutHToKen)
            whisper_writer.write(bytes_payload)
            await whisper_writer.drain()
            ready_event.set()
            if LoGinDaTaUncRypTinG.Clan_ID:
                clan_id = LoGinDaTaUncRypTinG.Clan_ID
                clan_compiled_data = LoGinDaTaUncRypTinG.Clan_Compiled_Data
                print('\n - TarGeT BoT in CLan ! ')
                print(f' - Clan Uid > {clan_id}')
                print(f' - BoT ConnEcTed WiTh CLan ChaT SuccEssFuLy ! ')
                pK = await AuthClan(clan_id, clan_compiled_data, key, iv)
                if whisper_writer:
                    whisper_writer.write(pK)
                    await whisper_writer.drain()
            while True:
                data = await reader.read(9999)
                if not data:
                    break

                if data.hex().startswith("120000"):
                    msg = await DeCode_PackEt(data.hex()[10:])
                    chatdata = json.loads(msg)
                    try:
                        response = await DecodeWhisperMessage(data.hex()[10:])
                        uid = response.Data.uid
                        chat_id = response.Data.Chat_ID
                        XX = response.Data.chat_type
                        inPuTMsG = response.Data.msg.lower()
                    except:
                        response = None

                    if response:
                        if not get_rate_limited_response(uid):
                            continue

                        if is_bot_muted():
                            continue






                        if inPuTMsG.startswith('/spam '):
                            parts = inPuTMsG.split()
                            if len(parts) >= 2:
                                target_uid = parts[1]
                                duration = None
                                if len(parts) >= 3:
                                    try:
                                        duration = int(parts[2])
                                    except:
                                        pass
                                if spam_active:
                                    await safe_send_message(XX, "[FF0000]Spam already running! Use /stp first", uid, chat_id, key, iv)
                                    continue
                                spam_active = True
                                spam_task = asyncio.create_task(spam_worker(target_uid, duration, asyncio.Event()))
                                dur_msg = f" for {duration} min" if duration else ""
                                await safe_send_message(XX, f"[00FF00]Spam started on {target_uid}{dur_msg}\nUse /stp to stop", uid, chat_id, key, iv)
                            else:
                                await safe_send_message(XX, "[FF0000]Usage: /spam <uid> [duration_in_minutes]", uid, chat_id, key, iv)
                            continue


                        spam_tasks = {}
                        spam_uids = set()


                        if inPuTMsG.startswith('/spm '):
                            parts = inPuTMsG.split()

                            if len(parts) >= 2:
                                target_uid = parts[1]

                                if target_uid in spam_tasks:
                                    await safe_send_message(
                                        XX,
                                        "[b][c][FFFFFF]Spam already running for this UID!",
                                        uid,
                                        chat_id,
                                        key,
                                        iv
                                    )
                                    continue

                                spam_uids.add(target_uid)

                                async def run_spam(target_uid):
                                    global spam_requests_sent

                                    while target_uid in spam_uids:
                                        try:
                                            url = f"http://de22.spaceify.eu:26240/spam_vip?id={target_uid}"

                                            res = await asyncio.to_thread(
                                                requests.get,
                                                url,
                                                timeout=15
                                            )

                                            if res.status_code == 200:
                                                spam_requests_sent += 1
                                            else:
                                                print(f"API Error: {res.status_code}")

                                        except Exception as e:
                                            print(f"Spam API connection failed: {e}")

                                        await asyncio.sleep(1)

                                spam_tasks[target_uid] = asyncio.create_task(
                                    run_spam(target_uid)
                                )

                                await safe_send_message(
                                    XX,
                                    f"[b][c][FFFFFF]Spam started for {target_uid}",
                                    uid,
                                    chat_id,
                                    key,
                                    iv
                                )

                            else:
                                await safe_send_message(
                                    XX,
                                    "[FF0000]Usage: /spm <uid>",
                                    uid,
                                    chat_id,
                                    key,
                                    iv
                                )

                            continue


                        if inPuTMsG.startswith('/stp '):
                            parts = inPuTMsG.split()

                            if len(parts) >= 2:
                                target_uid = parts[1]

                                if target_uid not in spam_tasks:
                                    await safe_send_message(
                                        XX,
                                        "[b][c][FFFFFF]No active spam for this UID",
                                        uid,
                                        chat_id,
                                        key,
                                        iv
                                    )
                                    continue

                                stop_url = f"http://de22.spaceify.eu:26240/stop?id={target_uid}"

                                try:
                                    async with httpx.AsyncClient(timeout=5) as client:
                                        resp = await client.get(stop_url)

                                        if resp.status_code == 200:

                                            spam_uids.discard(target_uid)

                                            spam_tasks[target_uid].cancel()
                                            del spam_tasks[target_uid]

                                            await safe_send_message(
                                                XX,
                                                f"[b][c][FFFFFF]Spam stopped for {target_uid}",
                                                uid,
                                                chat_id,
                                                key,
                                                iv
                                            )

                                        else:
                                            await safe_send_message(
                                                XX,
                                                f"[FFA500]Stop API returned {resp.status_code}",
                                                uid,
                                                chat_id,
                                                key,
                                                iv
                                            )

                                except Exception as e:
                                    await safe_send_message(
                                        XX,
                                        f"[FF0000]Failed to call stop API: {e}",
                                        uid,
                                        chat_id,
                                        key,
                                        iv
                                    )

                            else:
                                await safe_send_message(
                                    XX,
                                    "[FF0000]Usage: /stp <uid>",
                                    uid,
                                    chat_id,
                                    key,
                                    iv
                                )

                            continue

                        if inPuTMsG.startswith('/5') or inPuTMsG.startswith('/6'):
                            try:
                                squad_size = int(inPuTMsG[1]) if len(inPuTMsG) > 1 and inPuTMsG[1].isdigit() else 5
                                if squad_size not in [3,5,6]:
                                    squad_size = 5
                                message = f"[B][C]{get_random_color()}\n{squad_size}-Player Squad!\nAccept Fast"
                                await safe_send_message(XX, message, uid, chat_id, key, iv)
                                PAc = await OpEnSq(key, iv, region)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', PAc)
                                await asyncio.sleep(0.3)
                                C = await cHSq(squad_size, uid, key, iv, region)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', C)
                                await asyncio.sleep(0.3)
                                V = await SEnd_InV(squad_size, uid, key, iv, region)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', V)
                                await asyncio.sleep(7)
                                E = await ExiT(None, key, iv)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', E)
                                await safe_send_message(XX, f"[00FF00]✅ {squad_size}-Player Squad Created!", uid, chat_id, key, iv)
                            except Exception as e:
                                print(f'Error in squad command: {e}')
                            continue

                        if inPuTMsG.strip() == "/help":
                            update_command_stats("help")
                            
                            # الخانة الأولى
                            msg1 = f"""[b][c]{get_random_color()}إنشاء سكواد 

[b][c][FFFFFF] --> /3 , /5 , /6 

[b][c]{get_random_color()} الدخول للفريق

[b][c][FFFFFF] --> /join  <code>

[b][c]{get_random_color()} - دخول وإرسال رسالة 

[b][c][FFFFFF] --> /msg <code> <message>

[b][c]{get_random_color()} - هجوم الأشباح 

[b][c][FFFFFF] --> /ghost <code> <name>

[b][c]{get_random_color()} - إرسال دعوة (Invite) للاعب

[b][c][FFFFFF] --> /inv <uid>"""
                            await safe_send_message(XX, msg1, uid, chat_id, key, iv)

                            
                            msg3 = f"""[b][c]{get_random_color()} - حركة إيموت 

[b][c][FFFFFF] --> /e <uids> <emote>

[b][c]{get_random_color()} - مغادرة السكواد

[b][c][FFFFFF] --> /solo

[b][c]{get_random_color()} - وضع لاعب في مقبرة

[b][c][FFFFFF] --> /spm <uid>

[b][c]{get_random_color()} - حذف لاعب من مقبرة

[b][c][FFFFFF] --> /stp <uid>

[b][c]{get_random_color()} - حركات الأسلحة المتطورة

[b][c][FFFFFF] --> evo <uid>

[b][c]{get_random_color()} - معلومات مطور

[b][c][FFFFFF] --> /admin"""
                            await safe_send_message(XX, msg3, uid, chat_id, key, iv)
                            continue


                        
                        if inPuTMsG.startswith('/msg '):
                            try:
                                parts = inPuTMsG.strip().split(None, 2)
                                if len(parts) >= 3:
                                    t_code = parts[1]
                                    t_msg = parts[2]
                                    
                                    # إشعار البوت للمستخدم بالبدء
                                    await safe_send_message(XX, f"[00FF00]SPM MSG DONE", uid, chat_id, key, iv)
                                    
                                    # تشغيل عملية الإرسال كـ Task عشان ما يوقف البوت
                                    async def run_msg_attack():
                                        # 1. باكت الدخول
                                        join_p = await GenJoinSquadsPacket(t_code, key, iv)
                                        await SEndPacKeT(whisper_writer, online_writer, 'OnLine', join_p)
                                        await asyncio.sleep(1.5) # انتظار الدخول
                                        
                                        # 2. إرسال الرسالة 20 مرة
                                        for _ in range(30):
                                            t_msg_colored = f"[b][c]{get_random_color()}{t_msg}"
                                            # نرسل باكت شات عادي داخل السكواد
                                            msg_p = await SEndMsG(XX, t_msg_colored, uid, chat_id, key, iv)
                                            await SEndPacKeT(whisper_writer, online_writer, 'ChaT', msg_p)
                                            await asyncio.sleep(0.3)
                                            
                                        # 3. باكت الخروج
                                        exit_p = await ExiT(None, key, iv)
                                        await SEndPacKeT(whisper_writer, online_writer, 'OnLine', exit_p)
                                        await safe_send_message(XX, "[00FF00]", uid, chat_id, key, iv)

                                    asyncio.create_task(run_msg_attack())
                                    
                                else:
                                    await safe_send_message(XX, "[FF0000]الاستخدام: /msg [الكود] [الرسالة]", uid, chat_id, key, iv)
                            except Exception as e:
                                print(f"MSG Command Error: {e}")
                            continue
                        
                        if inPuTMsG.startswith('/ghost '):
                            try:
                                parts = inPuTMsG.strip().split(None, 2)
                                if len(parts) >= 3:
                                    t_code = parts[1]
                                    nm = parts[2]

                                    await safe_send_message(XX, f"[b][c][1E90FF]DONE CHABA7", uid, chat_id, key, iv)

                                    async def run_ghost():
                                        global ghost_event, ghost_data
                                        ghost_event.clear()
                                        ghost_data = None

                                        join_p = await GenJoinSquadsPacket(t_code, key, iv)
                                        await SEndPacKeT(whisper_writer, online_writer, 'OnLine', join_p)

                                        try:
                                            await asyncio.wait_for(ghost_event.wait(), timeout=8)
                                        except asyncio.TimeoutError:
                                            print('[GHOST] timeout waiting for squad data')

                                        if ghost_data:
                                            idT, sq = ghost_data
                                            exit_p = await ExiT(None, key, iv)
                                            await SEndPacKeT(whisper_writer, online_writer, 'OnLine', exit_p)
                                            await asyncio.sleep(0.2)
                                            ghost_p = await Send_GhosTs(idT, f'[b][c]{get_random_color()}{nm}', sq, key, iv)
                                            await SEndPacKeT(whisper_writer, online_writer, 'OnLine', ghost_p)
                                            await safe_send_message(XX, f"[b][c][00FF00]DONE CHABA7", uid, chat_id, key, iv)
                                        else:
                                            exit_p = await ExiT(None, key, iv)
                                            await SEndPacKeT(whisper_writer, online_writer, 'OnLine', exit_p)
                                            await safe_send_message(XX, "[FF0000]❌ فشل Ghost: لم يتم استلام بيانات السكواد", uid, chat_id, key, iv)

                                    asyncio.create_task(run_ghost())

                                else:
                                    await safe_send_message(XX, "[FF0000]الاستخدام: /ghost [الكود] [الاسم]", uid, chat_id, key, iv)
                            except Exception as e:
                                print(f"Ghost Command Error: {e}")
                            continue
                            
                        if inPuTMsG.startswith('/join '):
                            update_command_stats("join_squad")
                            try:
                                Code = inPuTMsG.split('join ')[1]
                                message = f"[B][C]{get_random_color()}\n🎯 Joining: {Code}"
                                await safe_send_message(XX, message, uid, chat_id, key, iv)
                                EM = await GenJoinSquadsPacket(Code, key, iv)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', EM)
                                await safe_send_message(XX, f"[00FF00]✅ Join Request! Code: {Code}", uid, chat_id, key, iv)
                            except:
                                pass
                            continue


                        if inPuTMsG.startswith('/inv '):
                            parts = inPuTMsG.strip().split()
                            if len(parts) >= 2:
                                target_uid = parts[1]
                                await safe_send_message(XX, f"[B][C]{get_random_color()}\nCreating 5-Player Group and sending request to {target_uid}...", uid, chat_id, key, iv)
                                try:
                                    PAc = await OpEnSq(key, iv, region)
                                    await SEndPacKeT(whisper_writer, online_writer, 'OnLine', PAc)
                                    await asyncio.sleep(0.3)
                                    C = await cHSq(5, int(target_uid), key, iv, region)
                                    await SEndPacKeT(whisper_writer, online_writer, 'OnLine', C)
                                    await asyncio.sleep(0.3)
                                    V = await SEnd_InV(5, int(target_uid), key, iv, region)
                                    await SEndPacKeT(whisper_writer, online_writer, 'OnLine', V)
                                    await asyncio.sleep(0.3)
                                    E = await ExiT(None, key, iv)
                                    await asyncio.sleep(2)
                                    await SEndPacKeT(whisper_writer, online_writer, 'OnLine', E)
                                    await safe_send_message(XX, f"[00FF00]✅ Invitation sent to {target_uid}!", uid, chat_id, key, iv)
                                except Exception as e:
                                    await safe_send_message(XX, f"[FF0000]Error sending invite: {e}", uid, chat_id, key, iv)
                            else:
                                await safe_send_message(XX, "[FF0000]Usage: /inv <uid>", uid, chat_id, key, iv)
                            continue

                        if inPuTMsG.startswith('evo'):
                            parts = inPuTMsG.split()
                            if len(parts) >= 2:
                                uids = [int(p) for p in parts[1:] if p.isdigit()]
                                if uids:
                                    await safe_send_message(XX, f"[00FF00]EVO Cycle Started for {len(uids)} UIDs!\nUse 'stop' to stop.", uid, chat_id, key, iv)
                                    asyncio.create_task(evo_cycle_command(uids, key, iv, region))
                                else:
                                    await safe_send_message(XX, "[FF0000]No valid UIDs", uid, chat_id, key, iv)
                            else:
                                await safe_send_message(XX, "[FF0000]Usage: evo uid1 uid2 ...", uid, chat_id, key, iv)
                            continue

                        if inPuTMsG.strip() == 'stop':
                            await stop_commands()
                            await safe_send_message(XX, "[FF0000]Stopped all running commands!", uid, chat_id, key, iv)
                            continue

                        if inPuTMsG.startswith('/solo'):
                            update_command_stats("solo")
                            try:
                                await safe_send_message(XX, "[FF6347][B]Leaving Squad...", uid, chat_id, key, iv)
                                leave = await ExiT(uid, key, iv)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', leave)
                                await safe_send_message(XX, "[00FF00]✅ Left Squad!", uid, chat_id, key, iv)
                            except:
                                pass
                            continue

                        if inPuTMsG.strip() == '/start':
                            message = f"""[C][B]
مرحبًا بكم في {get_random_color()} AMINE BOT

[C][B] للتواصل مع المطور

[808080]- Instagram => [00ff00] @mohamed_amin_dahbi
[808080]- Telegram => [00ff00] @WC_2C
"""
                            await safe_send_message(XX, message, uid, chat_id, key, iv)
                            EM = await FS(key, iv)
                            await SEndPacKeT(whisper_writer, online_writer, 'OnLine', EM)
                            await safe_send_message(XX, f"[{get_random_color()}]للعرض الاوامر ارسل /help", uid, chat_id, key, iv)
                            continue

                        if inPuTMsG.startswith('/admin'):
                            message = f"""[C][B]{get_random_color()}Hello, I'm aMiNe\n{get_random_color()}Dev: AMiNE\n\n{get_random_color()}Telegram: @WC_2C \n{get_random_color()}Instagram: @mohamed_amin_dahbi"""
                            await safe_send_message(XX, message, uid, chat_id, key, iv)
                            EM = await FS(key, iv)
                            await SEndPacKeT(whisper_writer, online_writer, 'OnLine', EM)
                            continue

                        if inPuTMsG.strip() == "/debug":
                            update_command_stats("debug")
                            debug_msg = f"[FF0000]✅ Jzr BOT ONLINE! UID: {uid}"
                            await safe_send_message(XX, debug_msg, uid, chat_id, key, iv)
                            continue

                        if inPuTMsG.startswith('/mute') and is_admin(uid):
                            parts = inPuTMsG.split()
                            if len(parts) >= 2:
                                time_str = parts[1]
                                if time_str.endswith('s'):
                                    duration = int(time_str[:-1])
                                elif time_str.endswith('m'):
                                    duration = int(time_str[:-1]) * 60
                                elif time_str.endswith('h'):
                                    duration = int(time_str[:-1]) * 3600
                                else:
                                    duration = int(time_str) * 60
                                is_muted = True
                                mute_until = time.time() + duration
                                await safe_send_message(XX, f"[FFB300]Bot muted for {time_str}", uid, chat_id, key, iv)
                            else:
                                await safe_send_message(XX, "[FF0000]Usage: /mute 30s/5m/1h", uid, chat_id, key, iv)
                            continue

                        if inPuTMsG.startswith('/unmute') and is_admin(uid):
                            is_muted = False
                            mute_until = 0
                            await safe_send_message(XX, "[00FF00]Bot unmuted", uid, chat_id, key, iv)
                            continue

                        if inPuTMsG.startswith('/ee '):
                            try:
                                parts = inPuTMsG.strip().split()
                                if len(parts) >= 4:
                                    team_code = parts[1]
                                    uids = []
                                    emote_id = None
                                    for i, part in enumerate(parts[2:], 2):
                                        if i < len(parts) - 1:
                                            if part.isdigit():
                                                uids.append(int(part))
                                        else:
                                            if part.isdigit():
                                                emote_id = int(part)
                                    if len(uids) >= 1 and emote_id:
                                        await safe_send_message(XX, f"[FFD700][B]━━━━━━━\n[FFFFFF]Joining: {team_code}\n[FFFFFF]UIDs: {len(uids)}\n[FFFFFF]🎭 Emote: {emote_id}\n[FFD700]━━━━━━━", uid, chat_id, key, iv)
                                        try:
                                            join_packet = await GenJoinSquadsPacket(team_code, key, iv)
                                            await SEndPacKeT(whisper_writer, online_writer, 'OnLine', join_packet)
                                            await asyncio.sleep(2)
                                        except:
                                            pass
                                        success_count = 0
                                        for target_uid in uids:
                                            try:
                                                H = await Emote_k(target_uid, emote_id, key, iv, region)
                                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', H)
                                                success_count += 1
                                                await asyncio.sleep(0.3)
                                            except:
                                                pass
                                        try:
                                            leave_packet = await ExiT(None, key, iv)
                                            await SEndPacKeT(whisper_writer, online_writer, 'OnLine', leave_packet)
                                        except:
                                            pass
                                        await safe_send_message(XX, f"[00FF00][B]━━━━━━━\n[FFFFFF]✅ Team Emote Complete!\nSuccess: {success_count}/{len(uids)}\nTeam: {team_code}\n🔄 Auto-Leave: ✅\n[FFD700]━━━━━━━", uid, chat_id, key, iv)
                                    else:
                                        await safe_send_message(XX, "[FF0000]Usage: /ee [TEAM_CODE] [UID1] [UID2] ... [EMOTE]", uid, chat_id, key, iv)
                                else:
                                    await safe_send_message(XX, "[FF0000]Usage: /ee [TEAM_CODE] [UID1] [UID2] ... [EMOTE]", uid, chat_id, key, iv)
                            except:
                                pass
                            continue

                        if inPuTMsG.startswith('/3'):
                            try:
                                message = f"[B][C]{get_random_color()}\n🎯 3-Player Squad!\nAccept Fast"
                                await safe_send_message(XX, message, uid, chat_id, key, iv)
                                PAc = await OpEnSq(key, iv, region)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', PAc)
                                await asyncio.sleep(0.3)
                                C = await cHSq(3, uid, key, iv, region)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', C)
                                await asyncio.sleep(0.3)
                                V = await SEnd_InV(3, uid, key, iv, region)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', V)
                                await asyncio.sleep(2)
                                E = await ExiT(None, key, iv)
                                await SEndPacKeT(whisper_writer, online_writer, 'OnLine', E)
                                await safe_send_message(XX, "[00FF00]✅ 3-Player Squad Created!", uid, chat_id, key, iv)
                            except:
                                pass
                            continue

            whisper_writer.close()
            await whisper_writer.wait_closed()
            whisper_writer = None

        except Exception as e:
            print(f"ErroR {ip}:{port} - {e}")
            whisper_writer = None
        await asyncio.sleep(reconnect_delay)

async def MaiiiinE():
    global connection_pool
    connection_pool = aiohttp.ClientSession(
        timeout=aiohttp.ClientTimeout(total=20),
        connector=aiohttp.TCPConnector(limit=20, limit_per_host=10)
    )

    Uid, Pw = '4802871314', '264C3571BB1CF710851AF3F483089CDC0C80E664BA775F8287345A9A0716A020'

    open_id, access_token = await GeNeRaTeAccEss(Uid, Pw)
    if not open_id or not access_token:
        print("ErroR - InvaLid AccounT")
        return None

    PyL = await EncRypTMajoRLoGin(open_id, access_token)
    MajoRLoGinResPonsE = await MajorLogin(PyL)
    if not MajoRLoGinResPonsE:
        print("TarGeT AccounT => BannEd / NoT ReGisTeReD ! ")
        return None

    MajoRLoGinauTh = await DecRypTMajoRLoGin(MajoRLoGinResPonsE)
    UrL = MajoRLoGinauTh.url
    print(UrL)
    region = MajoRLoGinauTh.region

    ToKen = MajoRLoGinauTh.token
    TarGeT = MajoRLoGinauTh.account_uid
    key = MajoRLoGinauTh.key
    iv = MajoRLoGinauTh.iv
    timestamp = MajoRLoGinauTh.timestamp

    LoGinDaTa = await GetLoginData(UrL, PyL, ToKen)
    if not LoGinDaTa:
        print("ErroR - GeTinG PorTs From LoGin DaTa !")
        return None
    LoGinDaTaUncRypTinG = await DecRypTLoGinDaTa(LoGinDaTa)
    OnLinePorTs = LoGinDaTaUncRypTinG.Online_IP_Port
    ChaTPorTs = LoGinDaTaUncRypTinG.AccountIP_Port
    OnLineiP, OnLineporT = OnLinePorTs.split(":")
    ChaTiP, ChaTporT = ChaTPorTs.split(":")
    acc_name = LoGinDaTaUncRypTinG.AccountName
    print(ToKen)
    equie_emote(ToKen, UrL)
    AutHToKen = await xAuThSTarTuP(int(TarGeT), ToKen, int(timestamp), key, iv)
    ready_event = asyncio.Event()

    task1 = asyncio.create_task(TcPChaT(ChaTiP, ChaTporT, AutHToKen, key, iv, LoGinDaTaUncRypTinG, ready_event, region))

    await ready_event.wait()
    await asyncio.sleep(1)
    task2 = asyncio.create_task(TcPOnLine(OnLineiP, OnLineporT, key, iv, AutHToKen))
    os.system('clear')
    print(render('AMINE BoT', colors=['white', 'green'], align='center'))
    print('')
    print(f" - G5 BOT Starting on Target : {TarGeT} | BOT NAME : {acc_name}\n")
    print(f" - Bot Status: Online")
    print(f" - DEV: wargood | Bot Uptime: {time.strftime('%H:%M:%S', time.gmtime(time.time() - bot_start_time))}")
    await asyncio.gather(task1, task2)

async def StarTinG():
    while True:
        try:
            await asyncio.wait_for(MaiiiinE(), timeout=7 * 60 * 60)
        except asyncio.TimeoutError:
            print("Token Expired! Restarting")
        except Exception as e:
            print(f"Error TCP - {e} => Restarting ...")

if __name__ == '__main__':
    asyncio.run(StarTinG())