const express = require('express');
const router = express.Router();
const path = require('path');
const IdList = require(path.resolve('models/IdList.js'));
const Tour = require(path.resolve('models/Tour.js'));
const DatVe = require(path.resolve('models/DatVe.js'));

function tourForm(tour) {
    return {
        ma: tour.ma,
        ten: tour.ten,
        thoiGian: tour.thoiGian,
        ngayKhoiHanh: tour.ngayKhoiHanh,
        noiKhoiHanh: tour.noiKhoiHanh,
        phuongTien: tour.phuongTien,
        gia: tour.gia,
        diaDiem: tour.diaDiem,
    };
}

function userForm(user) {
    return {
        ten: user.ten || null,
        email: user.email || null,
        soDT: user.soDT || null,
        diaChi: user.diaChi || null,
    };
}

function formDatVe(ve, tour) {
    return {
        ma: ve.ma,
        thoiGianDat: ve.thoiGianDat,
        tour: tourForm(tour),
        thongTin: userForm(ve),
        ghiChu: ve.ghiChu,
    };
}

router.post('/', async (req, res) => {
    const reqMaTour = req.body.maTour || null;
    // thong tin nguoi dung
    const reqTen = req.body.ten || null;
    const reqEmail = req.body.email || null;
    const reqSoDT = req.body.soDT || null;
    const reqDiaChi = req.body.diaChi || null;
    const reqGhiChu = req.body.ghiChu || '';

    try {
        if (
            reqMaTour == null ||
            reqTen == null ||
            reqEmail == null ||
            reqSoDT == null ||
            reqDiaChi == null
        ) {
            return res.json({
                success: false,
            });
        }

        const tour = await Tour.findOne({
            ma: reqMaTour,
        });
        if (tour == null) {
            return res.json({
                success: false,
            });
        }

        const currentId = await IdList.findOne({
            name: 'DatVe',
        });
        const count = currentId.currentId + 1;

        const ve = new DatVe({
            ma: count,
            maTour: reqMaTour,
            ten: reqTen,
            email: reqEmail,
            soDT: reqSoDT,
            diaChi: reqDiaChi,
            ghiChu: reqGhiChu,
            thoiGianDat: Date.now(),
        });

        currentId.currentId = count;
        await currentId.save();

        await ve.save();

        return res.json({
            data: formDatVe(ve, tour),
            success: true,
        });
    } catch {
        return res.json({
            success: false,
        });
    }
});

module.exports = router;
