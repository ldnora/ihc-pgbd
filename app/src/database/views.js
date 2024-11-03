const createViews = (db) => {
    const views = [
        // criar views
    ];

    views.forEach(view => {
        db.run(view, (err) => {
            if (err) {
                console.error('Erro ao criar view:', err);
            }
        });
    });
};

module.exports = { createViews };
