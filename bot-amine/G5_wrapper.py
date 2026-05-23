#!/usr/bin/env python3
"""
G5.py Wrapper - Reads UID and PASSWORD from environment variables
This allows the Node.js process manager to pass credentials via env vars
"""

import os
import sys

# Read credentials from environment variables
BOT_UID = os.getenv("BOT_UID")
BOT_PASSWORD = os.getenv("BOT_PASSWORD")
BOT_ACCOUNT_ID = os.getenv("BOT_ACCOUNT_ID")

if not BOT_UID or not BOT_PASSWORD:
    print("[ERROR] BOT_UID and BOT_PASSWORD environment variables are required")
    sys.exit(1)

# Patch the G5.py main function to use environment variables
import G5

# Override the hardcoded credentials in MaiiiinE function
original_MaiiiinE = G5.MaiiiinE

async def patched_MaiiiinE():
    """Patched version that uses env vars instead of hardcoded credentials"""
    import asyncio
    import aiohttp
    from G5 import (
        connection_pool, GeNeRaTeAccEss, EncRypTMajoRLoGin, MajorLogin,
        DecRypTMajoRLoGin, GetLoginData, DecRypTLoGinDaTa, xAuThSTarTuP,
        TcPChaT, TcPOnLine, render, time, bot_start_time, os as g5_os
    )

    # Use environment variables for credentials
    Uid = BOT_UID
    Pw = BOT_PASSWORD

    connection_pool = aiohttp.ClientSession(
        timeout=aiohttp.ClientTimeout(total=20),
        connector=aiohttp.TCPConnector(limit=20, limit_per_host=10)
    )

    open_id, access_token = await GeNeRaTeAccEss(Uid, Pw)
    if not open_id or not access_token:
        print(f"[ERROR] Invalid Account for UID {Uid}")
        return None

    PyL = await EncRypTMajoRLoGin(open_id, access_token)
    MajoRLoGinResPonsE = await MajorLogin(PyL)
    if not MajoRLoGinResPonsE:
        print(f"[ERROR] Target Account => BannEd / NoT ReGisTeReD for UID {Uid}")
        return None

    MajoRLoGinauTh = await DecRypTMajoRLoGin(MajoRLoGinResPonsE)
    UrL = MajoRLoGinauTh.url
    print(f"[BOT] Login URL: {UrL}")
    region = MajoRLoGinauTh.region

    ToKen = MajoRLoGinauTh.token
    TarGeT = MajoRLoGinauTh.account_uid
    key = MajoRLoGinauTh.key
    iv = MajoRLoGinauTh.iv
    timestamp = MajoRLoGinauTh.timestamp

    LoGinDaTa = await GetLoginData(UrL, PyL, ToKen)
    if not LoGinDaTa:
        print("[ERROR] Failed to get login data")
        return None

    LoGinDaTaUncRypTinG = await DecRypTLoGinDaTa(LoGinDaTa)
    OnLinePorTs = LoGinDaTaUncRypTinG.Online_IP_Port
    ChaTPorTs = LoGinDaTaUncRypTinG.AccountIP_Port
    OnLineiP, OnLineporT = OnLinePorTs.split(":")
    ChaTiP, ChaTporT = ChaTPorTs.split(":")
    acc_name = LoGinDaTaUncRypTinG.AccountName
    print(f"[BOT] Account Name: {acc_name}")

    AutHToKen = await xAuThSTarTuP(int(TarGeT), ToKen, int(timestamp), key, iv)
    ready_event = asyncio.Event()

    task1 = asyncio.create_task(TcPChaT(ChaTiP, ChaTporT, AutHToKen, key, iv, LoGinDaTaUncRypTinG, ready_event, region))

    await ready_event.wait()
    await asyncio.sleep(1)
    task2 = asyncio.create_task(TcPOnLine(OnLineiP, OnLineporT, key, iv, AutHToKen))
    
    g5_os.system('clear')
    print(render('AMINE BoT', colors=['white', 'green'], align='center'))
    print('')
    print(f" - G5 BOT Starting on Target : {TarGeT} | BOT NAME : {acc_name}")
    print(f" - Bot Status: Online")
    print(f" - Account ID: {BOT_ACCOUNT_ID}")
    print(f" - DEV: wargood | Bot Uptime: {time.strftime('%H:%M:%S', time.gmtime(time.time() - bot_start_time))}")
    
    await asyncio.gather(task1, task2)

# Replace the original function
G5.MaiiiinE = patched_MaiiiinE

# Run the bot
if __name__ == "__main__":
    import asyncio
    asyncio.run(G5.StarTinG())
