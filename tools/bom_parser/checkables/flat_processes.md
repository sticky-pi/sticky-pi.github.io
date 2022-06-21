"name"
"tag"
"description"
"asset"
"note"
"1"
"Burn SD card"
"_burn_sd_card"
"1. Install the [etcher](https://www.balena.io/etcher/) free software
2. Insert the SD card in the [microSD card adaptor](#sd_card_adaptor)
3. Select \"Flash from URL\" and enter {SD_IMAGE_LINK}. If you flash multiple SD cards, you can also download this file
4. Ensure you select the right SD card as the \"target\" and press flash
5. Verify that the operation was successful"
NA
""
"2"
"Mount camera"
"_mount_camera"
"1. Unbox the [Pi Camera HQ](#camera) and the [lens](#lens)
2. Remove the flex connector, tripod mount (using an [allen key](#-allen_key)), the C-CS adaptor, and the dust cap
3. Screw the lens tight on the camera (you should feel no resistance)
4. Use four [6mm m3 self-tapping screws](#screw_m3x6) to secure the camera on the [sledge](#pi_sledge). The connector of the camera should point towards the solid vertical wall of the sledge
5. Connect and thread the [flex connector](#flex_connector) as shown in the video"
NA
"Be gentle when handling optics and electronics. You might need to file the screw holes of the camera a little bit, as in the video, depending on the screws you got"
"3"
"Prepare Pi Zero"
"_prep_pi_zero"
"1. Unbox the [Raspberry Pi Zero](#pi_zero)
2. Solder the [male headers](#header_male_2x20)
3. Insert the [flashed SD card](#burnt_sd_card)"
NA
"Whilst soldering, you want to sink the heat (for instance, using a [breadboard](-breadboard)) and go quickly so not to stress the board "
"4"
"Prepare Pi hat"
"_prep_pi_hat"
"1. Solder the [terminal block](#terminal_block) onto our [custom Pi hat](#pi_hat). The holes should face towards the centre of the board
2. Solder a [2x1 male header](#header_male_2x1) on the \"testing\" slot of our [custom Pi hat](#pi_hat)
3. Insert a [coin cell](#coin_cell) in the battery slot of our [custom Pi hat](#pi_hat)"
NA
""
"5"
"Assemble sledge"
"_assemble_sledge"
"1. Connect the [prepared Pi hat](#prep_pi_hat) to the [prepared Raspberry Pi Zero](#prepped_pi_zero)
2. Position the Pi Zero on the [sledge with the mounted camera](#mounted_camera) so that the Pi's camera connector face towards the camera
3. Connect the flex connector to the Raspberry Pi
4. Align the board corner holes with the holes on the sledge
5. Screw [self-tapping 20mm m3 screws](#screw_m3x20), one by one, through corner holes, from the top side whilst holding a [standoff](#pi_standoff) between the Pi hat and the Pi zero.
6. Use duct tape to secure two [silica desiccant bags](#silica_bag) on the sledge"
NA
"Ideally, you can dry your silica bag (e.g. in an oven) before assembly."
"6"
"Epoxy tube"
"_epoxy_tube"
"1. Lay some [parchment](#parchment_paper) on your bench
2. Prepare some [epoxy](#epoxy), following the manufacturer's instruction (10mL should be enough for a tube).
3. Use a paper towel to apply epoxy on the [camera box tube](#cambox_tube), both inside and outside
4. Remove excess, in particular on the edges
5. Let the part cure for 24h, sidewise, on the parchment"
NA
"Rather than epoxying parts one by one, it is often less wasteful and more efficient to do it in a batch."
"7"
"Prepare Cambox Front"
"_prep_cambox_front"
"1. Use a [custom glass cutting gauge](#-glass_cut_gauge) and a [glass cutting pencil](#-glass-pencil) to cut a [microscope glass side](#glass_slide) into a 25x25mm piece
2. Use a [hot glue gun](#-hot_glue_gun) and [hot glue](#hot_glue) to glue the cut slide to the **outside** of the [camera box front](#cambox_front)
3. When set, use [modeling clay](#clay), cut with a [square cutter](#square_cutter), to make a casting mask on the **inside** of the camera box front
4. Press the clay square on the glass, visually ensure it is sealed, and check there is, at least, a 3mm margin between the clay and the edge of the glass
5. Lay the camera box front on [parchment](#parchment_paper)
6. Cast [epoxy](#epoxy) around the glass to embed it in the camera box front
7. Wait 24h, remove the clay, and clean with detergent and a [toothbrush](-tooth-brush)
8. Cut an 80x5mm strip of foam and insert it in the grove of the camera box front"
NA
"Rather than epoxying parts one by one, it is often less wasteful and more efficient to do it in a batch."
"8"
"Mount Cambox Font"
"_mount_cambox_front"
"1. Place the [prepared camera box front](#prep_cambox_front) on the [epoxied camera box tube](#epoxied_tube), so that the holes align. You can push and twist the camera bx front on the tube.
2. Place the [camera box visor](#cambox_visor) on the camera box front, so that the pointy triangular edges align.
3. Use four [self-tapping 14mm m3 screws](#screw_m3x14) to lock all three parts together. Ensure you press the parts together to improve sealing"
NA
"If the screw holes of the camera box tube have some epoxy in, you may want to tap them with a small drill bit"
"9"
"Prepare Humidity Sensor"
"_prep_dht"
"1. Split a [ribbon cable](#ribbon cable) to keep three cores, and cut a 30cm long piece. Pick three distinctive colours
2. Peel both ends of the ribbon cables ([wire strippers](#-strippers) can be useful)
3. Slide 1cm long [narrow heatshrink](#heatshrink_small) onto the three cores, on one end of the  ribbon cable.
4. Solder the three cores on the `+`, `data` and `-` pins of the [DHT22](#dht22)
5. Shrink the heatshrink around the solder
6. Thread the ribbon cable inside the hole of the [dht22 shell](#dht_shell) and screw the dht22 inside the shell with two [self-tapping 6mm m3 screws](#screw_m3x6)
7. Apply some liquid tape to fill the cable hole in the dht shell and on the connections of the DHT22, to prevent corrosion"
NA
""
"10"
"Prepare cambox back"
"_prep_cambox_back"
"1. Screw the [cable gland](#cable_gland) tight so that the long part is on the flat (outside) side of the [camera box back](#cambox_back). Use a [14mm wrench](#-wrench_14mm)
2. Screw the [push button](#push_button) from the outside. You might need [pliers](#-pliers_large)
3. Shorten the legs of the [orange LED](#led_orange) to about 5 and 6mm, for `-` and `+` pins. And insert the LED in the inside of the camera box back
4. Split, cut, and strip the ends of two pieces of two-core 10mm of [ribbon cable](#ribbon_cable). Choose sensible consistent and colours
5. Using [large heatshrink](#heatshrink_black), solder one end of the ribbon cable to push button.
6. Using [small heatshrink](#heatshrink_small), solder one end of the ribbon cable to the orange LED. Keep track of which colour is the `+` (long leg). Use [liquid tape](#liquid_tape], to seal the LED inside its socket. Allow for the liquid tape to cure (a few minutes)
7. Cast a single drop of [epoxy](#epoxy) on the outside hole of the LED socket. Allow 24h for the epoxy to cure
8. Cut an 80x5mm strip of foam and insert it in the grove of the camera box front"
NA
"Rather than epoxying parts one by one, it is often less wasteful and more efficient to do it in a batch."
"11"
"Prepare connector"
"_prep_connector"
"1. Cut and strip the ends of 10cm of a [two-core 24AWG](#cable_twocore) wire
2. Strip the end of the [male two-pin automotive connector](#auto_connector)
3. Using [black](#heatshrink_black) and [red heatshrink](#heatshrink_red), splice and solder cables together. Ensure none of the cable cores are exposed."
NA
""
"12"
"Merge sledge and prepped cambox back"
"_merge_sledge_back"
""
NA
""
"13"
"Prepare lightbox back"
"_prep_lightbox_back"
"1. Cut six pieces of [white LED strips](#led_strips) to the length of the [lightbox back](#lightbox_back) groves
2. Use [wire clippers](#-wire-clippers) to remove all the + pads on one side of the six LED strip sections, and all the - on the other side
3. Place the LED strips inside the groves in the lightbox back, so that all the terminal + pads are on one side and all the - on the other side
4. Cut two 14cm of [copper wire](#wire_copper). Use masking tape to keep the copper on top of the pads, and solder to join all + on one side and all - on the other
5. Cut 70cm of [two-core 24 AWG cable](#cable_twocore). Strip the ends
6. Insert the cable from the outside of the lightbox back, through the narrow round hole, and solder the red to a + pad, and the black to - a pad, on the first LED strip available
7. Use a [small zip tie](#zip_tie_small), on the inside of the box to lock the cable in place"
NA
"Remember to test the lightbox!"
"14"
"Assemble lightbox"
"_assemble_lightbox"
"1. To test the lightbox, connect the external end of the 70cm cable to a 5V power supply (e.g. a stipped USB cable will do). All lights should brighten. 
2. Cast 50mL of [epoxy](#epoxy) inside the lightbox to seal the lights and wires in place
3. Allow 24h to cure
4. Re-test the light box as above
5. Apply some [silicone](#silicone) in the grove of the [lightbox front](#lightbox_front). 
6. Put the front and back of the lightbox together, press and allow for the silicone to cure"
NA
""
"15"
"Connect cambox to peripherals"
"_merge_slab_dht_lightbox"
"1. Through the cable gland, in the [back of the camera box](#slab), thread, the [assembled dht22 sensor](#prepped_dht), the [prepped power connector](#prepped_connector) and the cable from the [lightbox](#assembled_lightbox)
2. Use a [small screw driver](#-screwdriver_flat) and a pair of forceps to insert and screw the cable end one by one.
3. Each of the 11 terminal block sockets on our [custom Pi had] is labelled. From left to right, connect the battery (+, -), the push button (2 slots), the orange LED (+, -), the DHT22 (+, data, -), the lightbox (i.e., flash:  +, -)."
NA
"It is important to quality control this step. You want to try to remove every individual cable with forceps and ensure it holds. You should visually check that each cable it at the right place. Also, ensure no loose copper stand sticks out of any socket."
"16"
"Test device"
"_test_device"
"Testing is is described in the [user manual section](user-manual). Briefly:
 
1. Prepare the following accessories for testing:
    * a female header testing bridge
    * a female auto connector connected to a 5V supply (e.g. USB)
    * a testing rig, with a platform to hold the device and wall at focusing distance 
    * an [hdmi cable](#-hdmi_to_micro) cable and a monitor
    * a data harvester ready to use
2. Connect the Raspberry Pi to the screen, with the HDMI cable
3. put the testing bridge to connect the two testing pins of our custom Pi hat
4. Power the board with the female auto connector. **Do not unplug**. You should see the orange LED turning on immediately
5. After a few second, the screen display some information, the first time a new system is booted, it initialises itself (e.g. format the SD card). This should take a minute or so. The system will automatically reboot in testing mode afterwards (if the testing bridge is on).
6. The system will then go through a series of interactive checks to test and set the peripherals (sensors, LED, button, camera)
7. Once done, the system can be paired to a data harvester, using the mobile app"
NA
""
"17"
"Assemble camera box"
"_assemble_cambox"
"1. Insert the [tested device](#tested_device) in the [camera tube](#mounted_cambox_tube), the lens of the camera should fit in the slot on the [camera box front](#cambox_front)
2. Use four [self-tapping 14mm m3 screws](#screw_m3x14) to attach the [tested device](#tested_device) to the camera box tube. Ensure you press the parts together to improve sealing.
3. Use two [long zip ties](zip_tie_long) to attach the [dht22 sensor and its shell](#prepped_dht) around the tube. the sensor should face down, away from the pointy edges of the camera box.
4. Use the [14mm wrench](#-wrench_14mm) to tighten the cable gland."
NA
""
"18"
"Merge camera box to lightbox"
"_merge_cambox_lightbox"
"1. Screw an [m3 nut](nut_standard_m3) in both ends of four [25cm m3 rods](#rod_m3x250), about 3cm along
2. Fit a [drawer hook](#drawer_hook) on each m3 rod, so that the flat side matches the m3 screw. Insert this end of the rods on the lightbox, from the front. Use an [acorn nut](nut_acorn_m3), from the back of the lightbox to lock the rod in place. Just hand tighten for now
3. Coil the lightbox cable around the bottom left rod, to avoid having a loose cable.
4. Repeat the same process as 2., also using drawer hooks, as washers, for the [assembled camera box](#assembled_cambox). **Align the tops**: the pointy edges of the camera box, and the visor align with the top of the light box. Check the pictures if unsure
5. Use a pair of [5.5mm Wrenches](#-wrenches) to first tighten the acorn nuts, then each m3 nut against its acorn nut"
NA
""
